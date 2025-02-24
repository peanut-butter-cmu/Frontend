// import { useEffect } from "react";
// import { messaging } from "./firebase";
// import { getToken } from "firebase/messaging";

// const Notification = () => {
//     useEffect(() => {
//         const requestPermission = async () => {
//             try {
//                 const token = await getToken(messaging, { vapidKey: "BO4_ZrKbkO2ujkenilRZmFvCiHuLCSEkpblXOVfLrud03BILcqsCARMwPGW4HcJqx8mBF5FcwcYyF7HiSocgkos" });
//                 if (token) {
//                     console.log("Token generated:", token);
//                     // Send this token to your server to store it for later use
//                 } else {
//                     console.log("No registration token available.");
//                 }
//             } catch (err) {
//                 console.error("Error getting token:", err);
//             }
//         };

//         requestPermission();
//     }, []);

//     return <div>Notification Setup 🚀</div>;
// };

// export default Notification;