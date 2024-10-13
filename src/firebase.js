import { initializeApp } from "firebase/app";
// import "firebase/firestore"
import "firebase/database";
import { collection, getDocs, getFirestore } from "firebase/firestore/lite";
// import "firebase/storage"

// // const config = process.env.NODE_ENV === "development" ? JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG) : JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG_PUBLIC)

const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  projectId: process.env.VUE_APP_PROJECTID,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPID,
  measurementId: process.env.VUE_APP_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

// export const firebaseAnalytics = getAnalytics(appIniciated);

export const firebaseDB = { db: getFirestore(app), collection, getDocs };
// export const storageRef = app.storage().ref()

// export const whatsappConnections = firebaseDB.collection('whatsappConnections')
// export const usersRef = db.collection("users")
// export const roomsRef = db.collection("chatRooms")
// export const messagesRef = roomId => roomsRef.doc(roomId).collection("messages")

// export const filesRef = storageRef.child("files")

// export const dbTimestamp = firebase.firestore.FieldValue.serverTimestamp()
// export const deleteDbField = firebase.firestore.FieldValue.delete()
