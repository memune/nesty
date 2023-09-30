import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'; // v9에서 필요한 임포트
import { setDoc, doc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password); // v9 방식
}

export function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
};


export function logoutUser() {
    return signOut(auth); // v9 방식
}

