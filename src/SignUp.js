import React, { useState } from 'react'
import { IonButton,   IonInput, IonItem,  IonList,  IonPage,   setupIonicReact } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';

setupIonicReact({
  mode: 'md'
});

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <IonPage>
      <center>
        <h1 style={{
          marginTop: "25%"
        }}>Sign Up</h1>
        <IonList style={{
          margin: "auto",
          padding: "0",
          width: "80%",
          marginTop: "15%"
        }}>
          <IonItem>
            <IonInput onChange={(e) => setName(e.target.value)} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Name" />
          </IonItem>
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

          <IonButton onClick={async () => {
            if (name === null || email === null || password === null) return;
            try {

              await Filesystem.writeFile({
                path: ".user_picSafe_cred.txt",
                data: btoa(JSON.stringify({ name: name, email: email, password: password })),
                directory: Directory.Data
              })
              alert("You can log in now, dont forget your password, it is very unlikely to be recovered")
            } catch (err) {
              alert("Retry logging in later")
            }


          }} style={{
            marginTop: "10%"
          }}>Sign up</IonButton>
          <br></br>
          <div style={{
            display: "block",
            color: "blue",
            marginTop: "5%",
          }}>

            <p style={{ color: "black" }}>Have an account? <a href='/' style={{ color: "blue" }} onClick={() => navigate("/")}>Sign In</a></p>
          </div>
        </IonList>
      </center>
    </IonPage>
  )
}

export default Login
