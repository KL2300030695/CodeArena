const Auth = (() => {
  let currentUser = null;
  let authReady = false;
  let authReadyCallbacks = [];

  // Wait for Firebase module to load and initialize state
  function waitForFirebase() {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (window.FirebaseAuth && window.FirebaseOnAuthStateChanged) {
          clearInterval(check);
          window.FirebaseOnAuthStateChanged(window.FirebaseAuth, async (user) => {
            if (user) {
              await fetchUserProfile(user);
            } else {
              currentUser = null;
            }
            authReady = true;
            authReadyCallbacks.forEach(cb => cb());
            authReadyCallbacks = [];
            resolve();
          });
        }
      }, 50);
    });
  }

  // Auto-start waiting
  waitForFirebase();

  async function fetchUserProfile(firebaseUser) {
    const { doc, getDoc, setDoc } = window.FirebaseFirestore;
    const db = window.FirebaseDB;
    
    const userRef = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      currentUser = { uid: firebaseUser.uid, ...snap.data() };
    } else {
      // New user
      const name = firebaseUser.displayName || firebaseUser.email.split('@')[0];
      const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      
      let hash = 0;
      for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
      const avatarColor = `hsl(${Math.abs(hash % 360)}, 65%, 55%)`;
      
      const newUserProfile = {
        username,
        email: firebaseUser.email,
        avatarColor,
        joinDate: new Date().toISOString(),
        solved: [],
        attempted: []
      };
      
      await setDoc(userRef, newUserProfile);
      currentUser = { uid: firebaseUser.uid, ...newUserProfile };
    }
  }

  return {
    async fetchCurrentUser() {
      if (!authReady) {
        await new Promise(resolve => authReadyCallbacks.push(resolve));
      }
      return currentUser;
    },

    getCurrentUser() {
      return currentUser;
    },

    isLoggedIn() {
      return !!currentUser;
    },

    getSession() {
      return currentUser;
    },

    getToken() {
      // Not needed for serverless, but kept for compatibility
      return currentUser ? currentUser.uid : null;
    },

    logout() {
      if (window.FirebaseSignOut) {
        window.FirebaseSignOut(window.FirebaseAuth).then(() => {
          currentUser = null;
          location.hash = '#/login';
          if (window.App && window.App.render) App.render();
        });
      }
    },

    getProblemStatus(problemId) {
      if (!currentUser) return 'unsolved';
      if (currentUser.solved && currentUser.solved.includes(problemId)) return 'solved';
      if (currentUser.attempted && currentUser.attempted.includes(problemId)) return 'attempted';
      return 'unsolved';
    },

    getStats() {
      if (!currentUser) return { solved: 0, attempted: 0, total: 20, solvedIds: [], attemptedIds: [] };
      return {
        solved: currentUser.solved ? currentUser.solved.length : 0,
        attempted: currentUser.attempted ? currentUser.attempted.length : 0,
        total: 20,
        solvedIds: currentUser.solved || [],
        attemptedIds: currentUser.attempted || []
      };
    },

    getAvatarColor(username) {
      let hash = 0;
      for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
      return `hsl(${Math.abs(hash % 360)}, 65%, 55%)`;
    },

    async markSolved(problemId) {
      if (!currentUser) return;
      if (!currentUser.solved) currentUser.solved = [];
      if (!currentUser.attempted) currentUser.attempted = [];
      
      if (!currentUser.solved.includes(problemId)) {
        currentUser.solved.push(problemId);
        currentUser.attempted = currentUser.attempted.filter(id => id !== problemId);
        
        // Save to Firestore
        const { doc, updateDoc } = window.FirebaseFirestore;
        const userRef = doc(window.FirebaseDB, "users", currentUser.uid);
        await updateDoc(userRef, {
          solved: currentUser.solved,
          attempted: currentUser.attempted
        });
      }
    },

    async markAttempted(problemId) {
      if (!currentUser) return;
      if (!currentUser.solved) currentUser.solved = [];
      if (!currentUser.attempted) currentUser.attempted = [];
      
      if (!currentUser.solved.includes(problemId) && !currentUser.attempted.includes(problemId)) {
        currentUser.attempted.push(problemId);
        
        // Save to Firestore
        const { doc, updateDoc } = window.FirebaseFirestore;
        const userRef = doc(window.FirebaseDB, "users", currentUser.uid);
        await updateDoc(userRef, {
          attempted: currentUser.attempted
        });
      }
    }
  };
})();

window.Auth = Auth;
