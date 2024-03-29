import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, collection, addDoc, getDocs,query, where, deleteDoc } from 'firebase/firestore'; // <== 이 부분 추가

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

export async function saveMetadataToFirestore(metadata, userId) {
    const metadataCollection = collection(db, 'metadata');

    // Store metadata along with userId
    const docData = {
        ...metadata,
        userId: userId
    };

    try {
        await addDoc(metadataCollection, docData);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export async function getUserMetadata(userId) {
    const metadataCollection = collection(db, 'metadata');
    // const q = query(metadataCollection, where("userId", "==", userId));
    const metadataSnapshot = await getDocs(metadataCollection);
    const metadataList = [];
  
    metadataSnapshot.forEach(doc => {
      const data = doc.data();
      metadataList.push({
        ...data,
        docId: doc.id  // 이 줄을 추가합니다.
      });
    });
  
    return metadataList;
  }
// 기사 삭제
export async function deleteMetadata(docId) {
    const metadataDoc = doc(db, 'metadata', docId);
    await deleteDoc(metadataDoc);
  }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };