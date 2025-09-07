import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getMenu = (callback) => {
  const menuCollection = collection(db, "menu");
  const unsubscribe = onSnapshot(menuCollection, (snapshot) => {
    const menuItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(menuItems);
  });
  return unsubscribe;
};
