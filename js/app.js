// ============================================
// TCS NQT Coding Platform — SPA Router & App
// ============================================

const App = (() => {
  let currentRoute = '';
  let editorInitialized = false;
  let currentProblemId = null;

  // Route definitions
  const routes = {
    '#/': () => UI.renderDashboard(),
    '#/problems': () => UI.renderProblemList(),
    '#/submissions': () => UI.renderSubmissions(),
    '#/leaderboard': () => UI.renderLeaderboard(),
    '#/login': () => UI.renderLogin(),
    '#/profile': () => UI.renderProfile(),
  };

  function getRoute() {
    const hash = location.hash || '#/';
    // Check for problem detail route
    const problemMatch = hash.match(/^#\/problem\/(\d+)/);
    if (problemMatch) {
      return { type: 'problem', id: problemMatch[1] };
    }
    return { type: 'page', hash };
  }

  async function render() {
    const route = getRoute();
    const appEl = document.getElementById('app');

    // Dispose previous editor
    if (editorInitialized) {
      Editor.dispose();
      editorInitialized = false;
    }

    // Remove previous keyboard listeners
    currentProblemId = null;

    if (route.type === 'problem') {
      appEl.innerHTML = await UI.renderProblemDetail(route.id);
      currentProblemId = parseInt(route.id);
      await initEditor(currentProblemId);
      initPanelResizer();
    } else {
      const renderer = routes[route.hash] || routes['#/'];
      appEl.innerHTML = await renderer();
    }

    currentRoute = location.hash;

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }

  async function initEditor(problemId) {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;

    const container = document.getElementById('monaco-container');
    if (!container) return;

    const lang = 'python';
    const savedKey = `code_${problemId}_${lang}`;
    const savedCode = localStorage.getItem(savedKey);
    const code = savedCode || problem.boilerplate[lang] || '';

    await Editor.init(container, { code, language: lang });
    editorInitialized = true;

    // Auto-save on change
    const instance = Editor.getInstance();
    if (instance) {
      instance.onDidChangeModelContent(() => {
        const currentLang = Editor.getLanguage();
        localStorage.setItem(`code_${problemId}_${currentLang}`, Editor.getCode());
      });

      // Add keyboard shortcuts to Monaco
      instance.addAction({
        id: 'run-code',
        label: 'Run Code',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => UI.runCode(problemId)
      });

      instance.addAction({
        id: 'submit-code',
        label: 'Submit Code',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: () => UI.submitCode(problemId)
      });
    }

    // Handle resize
    window.addEventListener('resize', () => Editor.resize());
  }

  // Resizable split panel
  function initPanelResizer() {
    const resizer = document.getElementById('panel-resizer');
    const descPanel = document.getElementById('problem-desc-panel');
    const editorPanel = document.getElementById('problem-editor-panel');

    if (!resizer || !descPanel || !editorPanel) return;

    let isResizing = false;
    let startX = 0;
    let startWidthLeft = 0;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidthLeft = descPanel.getBoundingClientRect().width;
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const container = descPanel.parentElement;
      const containerWidth = container.getBoundingClientRect().width;
      const resizerWidth = resizer.getBoundingClientRect().width;
      const newLeftWidth = startWidthLeft + (e.clientX - startX);
      const minWidth = 300;
      const maxWidth = containerWidth - resizerWidth - minWidth;

      if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
        const leftPercent = (newLeftWidth / containerWidth) * 100;
        const rightPercent = ((containerWidth - newLeftWidth - resizerWidth) / containerWidth) * 100;
        descPanel.style.width = leftPercent + '%';
        descPanel.style.flexShrink = '0';
        editorPanel.style.width = rightPercent + '%';
        editorPanel.style.flexShrink = '0';
        Editor.resize();
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        resizer.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        Editor.resize();
      }
    });
  }

  // Global keyboard shortcuts (for non-editor contexts)
  function initGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter / Cmd+Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && currentProblemId) {
        e.preventDefault();
        UI.runCode(currentProblemId);
      }
      // Ctrl+S / Cmd+S to submit code
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && currentProblemId) {
        e.preventDefault();
        UI.submitCode(currentProblemId);
      }
    });
  }

  // Initialize the app
  async function init() {
    window.addEventListener('hashchange', render);
    initGlobalShortcuts();
    
    // Fetch user session first if token exists
    if (Auth.getToken()) {
      await Auth.fetchCurrentUser();
    }
    
    // Remove the initial loader from index.html if it exists
    const loader = document.querySelector('.initial-loader');
    if (loader) loader.remove();
    
    render();
  }

  return { render, init };
})();

window.App = App;

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
