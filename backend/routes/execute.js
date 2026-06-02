const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');
const os = require('os');

const TIME_LIMIT = 5000;

router.post('/', async (req, res) => {
  const { language, version, files, stdin, run_timeout } = req.body;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files provided' });
  }

  const code = files[0].content;
  const timeoutMs = run_timeout || TIME_LIMIT;
  
  const jobId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `tcs_exec_${jobId}`);
  
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    
    if (language === 'java') {
      const fileName = files[0].name || 'Main.java';
      const className = fileName.replace('.java', '');
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, code);

      // Compile
      const compileProcess = spawn('javac', [filePath], { cwd: tempDir });
      let compileError = '';
      compileProcess.stderr.on('data', data => compileError += data.toString());
      compileProcess.on('error', err => compileError += 'Compiler not found: ' + err.message);
      
      const compileCode = await new Promise(resolve => compileProcess.on('close', resolve));
      if (compileCode !== 0) {
        return res.json({ compile: { code: compileCode || 1, stderr: compileError } });
      }

      // Run
      const runProcess = spawn('java', [className], { cwd: tempDir });
      let output = '';
      let error = '';
      
      if (stdin) {
        runProcess.stdin.write(stdin);
        runProcess.stdin.end();
      }

      runProcess.stdout.on('data', data => output += data.toString());
      runProcess.stderr.on('data', data => error += data.toString());
      runProcess.on('error', err => error += 'Runtime not found: ' + err.message);
      
      let isTimeout = false;
      const timer = setTimeout(() => {
        isTimeout = true;
        runProcess.kill('SIGTERM');
      }, timeoutMs);

      const runCode = await new Promise(resolve => runProcess.on('close', resolve));
      clearTimeout(timer);

      if (isTimeout) {
        return res.json({ run: { code: 1, signal: 'SIGTERM', stdout: output, stderr: error } });
      }

      return res.json({ run: { code: runCode || 0, stdout: output, stderr: error } });
      
    } else if (language === 'c') {
      const fileName = files[0].name || 'main.c';
      const filePath = path.join(tempDir, fileName);
      const exeName = process.platform === 'win32' ? 'main.exe' : 'main';
      const exePath = path.join(tempDir, exeName);
      fs.writeFileSync(filePath, code);

      // Compile
      const compileProcess = spawn('gcc', [filePath, '-o', exePath], { cwd: tempDir });
      let compileError = '';
      compileProcess.stderr.on('data', data => compileError += data.toString());
      compileProcess.on('error', err => compileError += 'Compiler not found: ' + err.message);
      
      const compileCode = await new Promise(resolve => compileProcess.on('close', resolve));
      if (compileCode !== 0) {
        return res.json({ compile: { code: compileCode || 1, stderr: compileError } });
      }

      // Run
      const runProcess = spawn(exePath, [], { cwd: tempDir });
      let output = '';
      let error = '';
      
      if (stdin) {
        runProcess.stdin.write(stdin);
        runProcess.stdin.end();
      }

      runProcess.stdout.on('data', data => output += data.toString());
      runProcess.stderr.on('data', data => error += data.toString());
      runProcess.on('error', err => error += 'Runtime not found: ' + err.message);
      
      let isTimeout = false;
      const timer = setTimeout(() => {
        isTimeout = true;
        runProcess.kill('SIGTERM');
      }, timeoutMs);

      const runCode = await new Promise(resolve => runProcess.on('close', resolve));
      clearTimeout(timer);

      if (isTimeout) {
        return res.json({ run: { code: 1, signal: 'SIGTERM', stdout: output, stderr: error } });
      }

      return res.json({ run: { code: runCode || 0, stdout: output, stderr: error } });
    } else {
      return res.status(400).json({ message: 'Language not supported by local executor' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Execution error' });
  } finally {
    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});

module.exports = router;
