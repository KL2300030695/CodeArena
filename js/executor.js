// ============================================
// TCS NQT Coding Platform — Code Execution Engine
// Python (Pyodide/WASM) + JavaScript execution
// ============================================

const Executor = (() => {
  let pyodide = null;
  let pyodideLoading = false;
  let pyodideReady = false;

  const TIME_LIMIT = 5000; // 5 seconds

  async function initPyodideRuntime() {
    if (pyodideReady) return;
    if (pyodideLoading) {
      // Wait for it to finish loading
      while (!pyodideReady) {
        await new Promise(r => setTimeout(r, 200));
      }
      return;
    }

    pyodideLoading = true;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js';
      script.onload = async () => {
        try {
          pyodide = await globalThis.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/'
          });
          pyodideReady = true;
          pyodideLoading = false;
          resolve();
        } catch (e) {
          pyodideLoading = false;
          reject(e);
        }
      };
      script.onerror = () => {
        pyodideLoading = false;
        reject(new Error('Failed to load Pyodide'));
      };
      document.head.appendChild(script);
    });
  }

  async function runPython(code, input) {
    await initPyodideRuntime();

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, output: '', error: 'Time Limit Exceeded', status: 'TLE' });
      }, TIME_LIMIT);

      try {
        // Set up input simulation
        const inputLines = input.trim().split('\n');
        let inputIdx = 0;

        pyodide.runPython(`
import sys
from io import StringIO

_input_data = ${JSON.stringify(inputLines)}
_input_idx = 0

def _custom_input(prompt=""):
    global _input_idx
    if _input_idx < len(_input_data):
        val = _input_data[_input_idx]
        _input_idx += 1
        return val
    return ""

__builtins__.input = _custom_input
sys.stdout = StringIO()
sys.stderr = StringIO()
        `);

        pyodide.runPython(code);

        const stdout = pyodide.runPython('sys.stdout.getvalue()');
        const stderr = pyodide.runPython('sys.stderr.getvalue()');

        // Reset
        pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `);

        clearTimeout(timeout);

        if (stderr) {
          resolve({ success: false, output: stdout, error: stderr, status: 'RE' });
        } else {
          resolve({ success: true, output: stdout.trim(), error: '', status: 'OK' });
        }
      } catch (e) {
        clearTimeout(timeout);
        // Reset stdout/stderr
        try {
          pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
          `);
        } catch (_) {}

        const errorMsg = e.message || String(e);
        // Extract meaningful Python error
        const lines = errorMsg.split('\n');
        const pyError = lines.filter(l => !l.includes('pyodide') && !l.includes('JsProxy')).join('\n') || errorMsg;

        resolve({ success: false, output: '', error: pyError, status: 'RE' });
      }
    });
  }

  function runJavaScript(code, input) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, output: '', error: 'Time Limit Exceeded', status: 'TLE' });
      }, TIME_LIMIT);

      try {
        const inputLines = input.trim().split('\n');
        let inputIdx = 0;
        let outputLines = [];

        // Create sandbox
        const sandbox = {
          console: {
            log: (...args) => outputLines.push(args.map(String).join(' ')),
            error: (...args) => outputLines.push(args.map(String).join(' ')),
          },
          prompt: () => {
            if (inputIdx < inputLines.length) return inputLines[inputIdx++];
            return '';
          },
          readline: () => {
            if (inputIdx < inputLines.length) return inputLines[inputIdx++];
            return '';
          },
          parseInt: parseInt,
          parseFloat: parseFloat,
          Math: Math,
          Number: Number,
          String: String,
          Array: Array,
          Object: Object,
          JSON: JSON,
          Map: Map,
          Set: Set,
          isNaN: isNaN,
          isFinite: isFinite,
          undefined: undefined,
          null: null,
          true: true,
          false: false,
          Infinity: Infinity,
          NaN: NaN,
        };

        // Wrap code to handle require('readline') pattern
        let wrappedCode = code;

        // Check if code uses readline interface pattern
        if (code.includes("require('readline')") || code.includes('require("readline")')) {
          wrappedCode = `
            const lines = ${JSON.stringify(inputLines)};
            let lineIdx = 0;
            const require = (mod) => {
              if (mod === 'readline') {
                return {
                  createInterface: (opts) => ({
                    on: function(event, cb) {
                      if (event === 'line') {
                        for (const line of lines) cb(line);
                      }
                      if (event === 'close') {
                        setTimeout(() => cb(), 0);
                      }
                      return this;
                    }
                  })
                };
              }
            };
            ${code.replace(/const input = require.*?\n/g, '').replace(/require\(['"]readline['"]\)/g, 'require("readline")')}
          `;
        }

        // Check for simpler input patterns
        if (code.includes('readline()') && !code.includes("require('readline')")) {
          wrappedCode = `
            const _inputLines = ${JSON.stringify(inputLines)};
            let _inputIdx = 0;
            function readline() {
              return _inputIdx < _inputLines.length ? _inputLines[_inputIdx++] : '';
            }
            ${code}
          `;
        }

        const fn = new Function(
          ...Object.keys(sandbox),
          wrappedCode
        );

        fn(...Object.values(sandbox));

        // Small delay for async callbacks
        setTimeout(() => {
          clearTimeout(timeout);
          resolve({
            success: true,
            output: outputLines.join('\n').trim(),
            error: '',
            status: 'OK'
          });
        }, 100);

      } catch (e) {
        clearTimeout(timeout);
        resolve({
          success: false,
          output: '',
          error: e.message || String(e),
          status: 'RE'
        });
      }
    });
  }

  return {
    // Run code against a single test case
    async runSingle(code, language, input) {
      if (language === 'python') {
        return await runPython(code, input);
      } else if (language === 'javascript') {
        return await runJavaScript(code, input);
      }
      return { success: false, output: '', error: 'Unsupported language', status: 'RE' };
    },

    // Run code against all test cases
    async runAllTests(code, language, testCases, onProgress) {
      const results = [];
      let passed = 0;

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const startTime = performance.now();
        const result = await this.runSingle(code, language, tc.input);
        const runtime = Math.round(performance.now() - startTime);

        const expected = tc.output.trim();
        const actual = result.output.trim();

        let status, statusLabel;
        if (result.status === 'TLE') {
          status = 'tle';
          statusLabel = 'Time Limit Exceeded';
        } else if (result.status === 'RE') {
          status = 'error';
          statusLabel = 'Runtime Error';
        } else if (actual === expected) {
          status = 'pass';
          statusLabel = 'Accepted';
          passed++;
        } else {
          status = 'fail';
          statusLabel = 'Wrong Answer';
        }

        const testResult = {
          testCase: i + 1,
          status,
          statusLabel,
          expected,
          actual: result.output.trim(),
          error: result.error,
          runtime,
          input: tc.input
        };

        results.push(testResult);

        if (onProgress) {
          onProgress(testResult, i + 1, testCases.length);
        }
      }

      return {
        results,
        passed,
        total: testCases.length,
        allPassed: passed === testCases.length,
        overallStatus: passed === testCases.length ? 'Accepted' :
                       results.some(r => r.status === 'tle') ? 'Time Limit Exceeded' :
                       results.some(r => r.status === 'error') ? 'Runtime Error' : 'Wrong Answer'
      };
    },

    // Check if Pyodide is ready
    isPyodideReady() {
      return pyodideReady;
    },

    // Preload Pyodide
    async preloadPyodide() {
      try {
        await initPyodideRuntime();
        return true;
      } catch {
        return false;
      }
    }
  };
})();

window.Executor = Executor;
