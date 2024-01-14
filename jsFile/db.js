// Import the functions you need from the SDKs you need
const firebase=require("firebase/app");
const firestore=require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi8lWU_BXQOEIMuv_Cn9xkv5wY61rC-sA",
  authDomain: "aprofit-ec8bc.firebaseapp.com",
  projectId: "aprofit-ec8bc",
  storageBucket: "aprofit-ec8bc.appspot.com",
  messagingSenderId: "38781738094",
  appId: "1:38781738094:web:a08f1473bfa790e366da7f"
};

// Initialize Firebase
const app=firebase.initializeApp(firebaseConfig);
const firestoreDb=firestore.getFirestore(app);

module.exports=firestoreDb;
