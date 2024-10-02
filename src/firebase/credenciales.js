// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import { getMessaging } from "firebase/messaging";

import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTHDOMAIN ,
  databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASEURL ,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECTID ,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGEBUCKET ,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGINGSENDERID ,
  appId: import.meta.env.VITE_APP_FIREBASE_APPID ,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENTID
};

// Inicializamos la aplicación y la guardamos en firebaseApp
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;


//CONFIGURACION FCM
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);


//Para subir archivos
export const storage = getStorage(firebaseApp)

export async function uploadFile(file) {
  const storageRef = ref(storage, v4 ())
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
  
}
