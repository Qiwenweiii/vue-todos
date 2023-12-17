import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCG1GC4XTX_2LhFCvkwWnyyUxD0s6hFNlQ',
  authDomain: 'todos-app-fef4c.firebaseapp.com',
  projectId: 'todos-app-fef4c',
  storageBucket: 'todos-app-fef4c.appspot.com',
  messagingSenderId: '595906946212',
  appId: '1:595906946212:web:77fae5f9a02670c8eaf231',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
