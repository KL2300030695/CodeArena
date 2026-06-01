const Submissions = (() => {
  return {
    async add(submission) {
      const session = Auth.getSession();
      if (!session) return null;
      
      const { collection, addDoc } = window.FirebaseFirestore;
      const db = window.FirebaseDB;
      
      try {
        const subData = {
          ...submission,
          uid: session.uid,
          timestamp: new Date().toISOString()
        };
        await addDoc(collection(db, "submissions"), subData);
        return true;
      } catch (e) {
        console.error("Firestore Add Submission Error:", e);
        return false;
      }
    },

    async getByUser(username) {
      const session = Auth.getSession();
      if (!session) return [];
      
      const { collection, getDocs, query, where } = window.FirebaseFirestore;
      const db = window.FirebaseDB;
      
      try {
        // Fetch all user submissions (manual sort to avoid requiring composite indexes immediately)
        const q = query(collection(db, "submissions"), where("uid", "==", session.uid));
        const snap = await getDocs(q);
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (e) {
        console.error("Firestore Get Submissions Error:", e);
        return [];
      }
    },

    async getFiltered(filters) {
      const session = Auth.getSession();
      if (!session) return [];
      
      const { collection, getDocs, query, where } = window.FirebaseFirestore;
      const db = window.FirebaseDB;
      
      try {
        let constraints = [where("uid", "==", session.uid)];
        if (filters.problemId) {
           constraints.push(where("problemId", "==", filters.problemId));
        }
        const q = query(collection(db, "submissions"), ...constraints);
        const snap = await getDocs(q);
        const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
      } catch (e) {
        console.error("Firestore Filtered Submissions Error:", e);
        return [];
      }
    },

    async getUserStats(username) {
       return Auth.getStats();
    }
  };
})();

window.Submissions = Submissions;
