// Archivo separado para las credenciales de Firebase
// Reemplaza los valores con tus credenciales reales.



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoIVJvUKltxN6YNKwSAdpVXIumqDoIoQM",
  authDomain: "videosfelicitacion-a8ba0.firebaseapp.com",
  projectId: "videosfelicitacion-a8ba0",
  storageBucket: "videosfelicitacion-a8ba0.firebasestorage.app",
  messagingSenderId: "881356004828",
  appId: "1:881356004828:web:42200303676fa7ce0ac319", 
  measurementId: "G-4808FP65HK"
};


// Inicialización general
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
