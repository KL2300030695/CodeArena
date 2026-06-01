// ============================================
// TCS NQT Coding Platform — Monaco Editor Setup
// ============================================

const Editor = (() => {
  let editorInstance = null;
  let currentLanguage = 'python';
  let isLoaded = false;
  let loadPromise = null;

  // Custom dark theme matching the platform
  const CUSTOM_THEME = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'C792EA' },
      { token: 'string', foreground: 'C3E88D' },
      { token: 'number', foreground: 'F78C6C' },
      { token: 'type', foreground: 'FFCB6B' },
      { token: 'function', foreground: '82AAFF' },
      { token: 'variable', foreground: 'F07178' },
      { token: 'operator', foreground: '89DDFF' },
      { token: 'delimiter', foreground: '89DDFF' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#264f78',
      'editorLineNumber.foreground': '#484f58',
      'editorLineNumber.activeForeground': '#e6edf3',
      'editor.inactiveSelectionBackground': '#1a2233',
      'editorCursor.foreground': '#6366f1',
      'editorWhitespace.foreground': '#2d333b',
      'editorIndentGuide.background': '#21262d',
      'editorIndentGuide.activeBackground': '#30363d',
      'scrollbarSlider.background': '#484f5833',
      'scrollbarSlider.hoverBackground': '#484f5866',
      'minimap.background': '#0d1117',
    }
  };

  function loadMonaco() {
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve) => {
      if (window.monaco) {
        resolve();
        return;
      }

      // Load Monaco via AMD loader
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
      script.onload = () => {
        require.config({
          paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
        });

        require(['vs/editor/editor.main'], () => {
          // Define custom theme
          monaco.editor.defineTheme('tcsNqtDark', CUSTOM_THEME);
          isLoaded = true;
          resolve();
        });
      };
      document.head.appendChild(script);
    });

    return loadPromise;
  }

  return {
    async init(container, options = {}) {
      await loadMonaco();

      const defaultCode = options.code || '# Write your code here\n';
      currentLanguage = options.language || 'python';

      editorInstance = monaco.editor.create(container, {
        value: defaultCode,
        language: currentLanguage,
        theme: 'tcsNqtDark',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        fontSize: 14,
        lineHeight: 22,
        fontLigatures: true,
        minimap: { enabled: true, scale: 2 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'off',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: 'all',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        suggest: {
          showMethods: true,
          showFunctions: true,
          showKeywords: true,
          showSnippets: true,
        },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        renderWhitespace: 'none',
        contextmenu: true,
      });

      return editorInstance;
    },

    getCode() {
      return editorInstance ? editorInstance.getValue() : '';
    },

    setCode(code) {
      if (editorInstance) {
        editorInstance.setValue(code);
      }
    },

    setLanguage(lang) {
      currentLanguage = lang;
      if (editorInstance) {
        const model = editorInstance.getModel();
        monaco.editor.setModelLanguage(model, lang);
      }
    },

    getLanguage() {
      return currentLanguage;
    },

    getInstance() {
      return editorInstance;
    },

    dispose() {
      if (editorInstance) {
        editorInstance.dispose();
        editorInstance = null;
      }
    },

    resize() {
      if (editorInstance) {
        editorInstance.layout();
      }
    },

    isReady() {
      return isLoaded && editorInstance !== null;
    }
  };
})();

window.Editor = Editor;
