import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBF_cwr1C274fKB5dN06H7awif8B-deBrU",
    authDomain: "smart-uni-f8286.firebaseapp.com",
    projectId: "smart-uni-f8286",
    storageBucket: "smart-uni-f8286.firebasestorage.app",
    messagingSenderId: "589561874159",
    appId: "1:589561874159:web:5c16837fda9c9d4d34bd1a",
    measurementId: "G-EDVZB65FTF"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };