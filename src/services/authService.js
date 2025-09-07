import { signInWithPopup,signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";

export const signInWithGoogle= async ()=> {
    //async function cuz we hv to wait for the user to sign in.
    try{
        //try to sign the user in
        const result=await signInWithPopup(auth,googleProvider);
        const user=result.user;
        console.log("User signed in successfully", user);
        return user;//send the user data back to whoever called this fucntionnnnnn....crazzzy
    }catch(error){
        //if it fails, do this.
        console.error("Error during Google Sign In", error);
    }
};

export const signOutUser= async() => {
    try{
        await signOut(auth);
        console.log("User signed out successfully");
    }catch(error){
        console.error("Error during sign out", error);
    }
}