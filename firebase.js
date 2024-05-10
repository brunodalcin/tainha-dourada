
const firebaseConfig = {
  apiKey: "AIzaSyC6ky-geR1U5gSku_x_py2jkfbP1S3lodg",
  authDomain: "tainha-dourada.firebaseapp.com",
  projectId: "tainha-dourada",
  storageBucket: "tainha-dourada.appspot.com",
  messagingSenderId: "398631166397",
  appId: "1:398631166397:web:82992903b63f021d1572d4",
  measurementId: "G-XSZEKMS7PC"
};

firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const auth = firebase.auth();