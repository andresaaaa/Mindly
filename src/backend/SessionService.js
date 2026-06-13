import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const SESSIONS_COLLECTION = 'sessions';

export const saveSession = async (userId, sessionData) => {
    try {
        const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
            userId,
            ...sessionData,
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error saving session to Firebase:", error);
        throw error;
    }
};

export const getUserSessions = async (userId) => {
    try {
        const q = query(
            collection(db, SESSIONS_COLLECTION),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const sessions = [];
        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
        });
        return sessions;
    } catch (error) {
        console.error("Error fetching sessions from Firebase:", error);
        throw error;
    }
};
