import React, { useState } from 'react'
import { IonButton, IonInput, IonItem,  IonList,   IonPage,   setupIonicReact, useIonLoading } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';

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
    try {
      const file = await Filesystem.readFile({
        path: '.user_picSafe_cred.txt',
        directory: Directory.Data
      });
      const user = JSON.parse(atob(file.data))
      if (email !== user.email || password !== user.password) {
        alert("Invalid credentials");
        return;
      }
      await dismiss()
      navigate("/main");
    } catch (err) {
      alert("Try again");
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
          <IonItem>
            <IonInput onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Password" />
            <ion-icon style={{ fontSize: "1.1rem" }} onClick={() => { setShowPassword(showPassword => !showPassword) }} name={!showPassword ? "eye-outline" : "eye-off-outline"}></ion-icon>
          </IonItem>
          <div style={{
            display: "block",
            color: "blue",
            marginTop: "5%",
            textAlign: "right",
          }}>
            <a href="#" style={{
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

            <p style={{ color: "black" }}>Dont have an account? <a href='#' style={{ color: "blue" }} onClick={() => navigate("/signup")}>Sign Up</a></p>
          </div>
        </IonList>
      </center>
      {/* <IonLoading trigger="open-loading" message="Logging in" duration={3000} /> */}

    </IonPage>
  )
}

export default Login
