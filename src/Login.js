import React, { useEffect, useState } from 'react'
import { IonButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonNavLink, IonPage, IonTitle, IonToolbar, setupIonicReact, useIonLoading } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Preferences } from '@capacitor/preferences';

setupIonicReact({
  mode: 'md'
});

function Login() {


  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [present, dismiss] = useIonLoading();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    async function permit() {
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage !== 'granted') {
        alert("No permissions")
        return;
      }
    }
    permit();
  }, [])

  const signIn = async () => {
    if (!email || !password) return;
    try {
      const file = await Filesystem.readFile({
        path: '.user_picSafe_cred.txt',
        directory: Directory.Data
      });

      const user = JSON.parse(atob(file.data))
      if (password != user.password) {
        alert("Invalid credentials");
        return;
      }
      await dismiss()
      await Preferences.set({ key: "lock", value: "false" });
      setTimeout(() => navigate("/main"), 0);
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
          <IonItem >
            <IonLabel position="stacked">Email</IonLabel>
            <input
              onChange={(e) => {
                setEmail(e.target.value || "")
              }}
              style={{ fontSize: "1.2rem", border: "none", outline: "none" }}
            />
          </IonItem>

          <IonItem >
            <IonLabel position="stacked">Password</IonLabel>
            <input
              onChange={(e) => {
                setPassword(e.target.value || "")
              }}
              type={showPassword ? 'text' : 'password'}
              style={{ fontSize: "1.2rem", border: "none", outline: "none" }}
            />
          </IonItem>
          <div style={{
            display: "block",
            color: "blue",
            marginTop: "5%",
            textAlign: "right",
          }}>
            <button className='toggle' onClick={() => setShowPassword(!showPassword)}> {!showPassword ? <FaEye /> : <FaEyeSlash />}</button>
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