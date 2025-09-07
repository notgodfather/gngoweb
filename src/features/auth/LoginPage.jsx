import React from 'react';
import { signInWithGoogle } from '../../services/authService';
const LoginPage =() => {
    const handleGoogleSignIn = async()=> {
        console.log("Login Button was clicked! Attempting to sign in...");
        const user=await signInWithGoogle();
        if(user){
            console.log("Login successful");
        }
    }
    return(
        <div style={styles.pageContainer}>
            <header style={styles.header}>
                <h1 style={styles.brandName}>GrabNGo</h1>
                <h2 style={styles.tagline}>Quick & Convenient Canteen Food Ordering</h2>
                <p>Skip the lines and order ahead with GrabNGo</p>
                <button style={styles.orderButton}>Order Now</button>
            </header>
            <main style={styles.mainContent}>
                <div style={styles.loginBox}>
                    <h3>Welcome to GrabNGo</h3>
                    <p>Order delicious meals from the campus canteen</p>
                    <button onClick={handleGoogleSignIn} style={styles.googleButton}>Sign in with Google</button>
                    <p style={styles.termsText}>By continuing, you agree to GrabNGo's Terms of Service & Privacy Policy.</p>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;

const styles = {
    pageContainer : {
        backgroundColor: '#fffaf0',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '50px 20px',
        minHeight: '100vh',
    },
    header:{
        marginBottom:'60px',
    },
    brandName:{
        fontSize:'24px',
        fontWeight:'bold',
    },
    tagline:{
        fontSize:'40px',
        fontWeight:'800',
        lineHeight:'1.2',
    },
    orderButton:{
        backgroundColor: '#F97316',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
    },
    mainContent:{
        display:'flex',
        justifyContent:'center',
    },
    loginBox:{
        backgroundColor:'white',
        padding:'40px',
        borderRadius:'16px',
        boxShadow:'0 10px 25px rgba(0,0,0,0.1)',
        maxWidth:'450px',
        width:'100%',
    },
    googleButton:{
        width:'100%',
        padding:'12px',
        border:'1px solid #E5E7EB',
        borderRaadius:'8px',
        cursor:'pointer',
        fontSize:'16px',
        margin:'25px 0',
    },
    termsText:{
        fontSize:'12px',
        color:'#6B7280',
    },
};