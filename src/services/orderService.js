import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const placeOrder = async (userId, cartItems, totalAmount) => {
  try {
    const orderData = {
      userId: userId,
      items: cartItems,
      total: totalAmount,
      status: "Awaiting Payment",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    console.log("Order has been placed with ID: ", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Error placing order: ", error);
    throw error;
  }
};
