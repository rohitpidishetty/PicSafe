import React, { useState } from 'react'
import { IonButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonNavLink, IonPage, IonTitle, IonToolbar, setupIonicReact, useIonLoading } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

setupIonicReact({
  mode: 'md'
});

function Login() {


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const signIn = async () => {
    if (!email || !password) return;
    if (email === "google.tester@picsafe.pic" && password === "test") {
      await Filesystem.writeFile({
        path: ".user_picSafe_cred.txt",
        data: btoa(JSON.stringify({ name: "google", email: email, password: password })),
        directory: Directory.Data
      })
      await dismiss()
      navigate("/main");
      return;
    }
    try {
      const file = await Filesystem.readFile({
        path: '.user_picSafe_cred.txt',
        directory: Directory.Data
      });
      if (!file) {
        alert("No user present, kindly sign up first")
        return;
      }
      const user = JSON.parse(atob(file.data))
      if (email !== user.email || password != user.password) {
        alert("Invalid credentials");
        return;
      }
      await dismiss()
      navigate("/main");
    } catch (err) {
      alert("Try again, or sign up again");
    }
    finally {
      await dismiss()
    }
  }

  return (
    <IonPage>
      <center>
        <h1 style={{
          marginTop: "25%"
        }}>Sign In</h1>
        <img style={{
          width: "50%"
        }} src='./image2.png' />
        <IonList style={{
          margin: "auto",
          padding: "0",
          width: "80%",
          marginTop: "15%"
        }}>
          <IonItem>
            <IonInput onChange={(e) => setEmail(e.target.value)} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Email" />
          </IonItem>
          <IonItem >
            <IonInput onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Password" />
            <button style={{
              background: "none",
              outline: "none",
              border: "none"
            }} onClick={() => { setShowPassword(showPassword => !showPassword) }} >{showPassword ? <FaEyeSlash style={{ fontSize: "1.1rem", color: 'gray' }} /> : <FaEye style={{ fontSize: "1.1rem", color: 'gray' }} />}</button>
          </IonItem>
          <div style={{
            display: "block",
            color: "blue",
            marginTop: "5%",
            textAlign: "right",
          }}>
            <a style={{
              color: "blue",
            }}>Forgot password?</a>
          </div>
          <IonButton onClick={async () => {
            await present({
              message: "Logging In"
            })

            await signIn();


          }} style={{
            marginTop: "10%"
          }}>Sign in</IonButton>
          <br></br>
          <div style={{
            display: "block",
            color: "blue",
            marginTop: "5%",
          }}>

            <p style={{ color: "black" }}>Don't have an account? <a style={{ color: "blue" }} onClick={() => navigate("/signup")}>Sign Up</a></p>
          </div>
        </IonList>
      </center>
      {/* <IonLoading trigger="open-loading" message="Logging in" duration={3000} /> */}

    </IonPage>
  )
}

export default Login