import React, { useState } from 'react'
import { IonButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNavLink, IonPage, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
        <img style={{
          width: "60%"
        }} src='./image1.png' />
        <IonList style={{
          margin: "auto",
          padding: "0",
          width: "80%",
          marginTop: "15%"
        }}>
          <IonItem>
            <IonInput onIonChange={(e) => setName(e.target.value)} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Name" />
          </IonItem>
          <IonItem>
            <IonInput onIonChange={(e) => setEmail(e.target.value)} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Email" />
          </IonItem>
          <IonItem>
            <IonInput onIonChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} style={{
              fontSize: "1.2rem"
            }} labelPlacement="stacked" label="Password" />
            <button style={{
              background: "none",
              outline: "none",
              border: "none"
            }} onClick={() => { setShowPassword(showPassword => !showPassword) }} >{showPassword ? <FaEyeSlash style={{ fontSize: "1.1rem", color: 'gray' }} /> : <FaEye style={{ fontSize: "1.1rem", color: 'gray' }} />}</button>
          </IonItem>

          <IonButton onClick={async () => {
            if (name === null || email === null || password === null) return;
            try {

              const response = window.confirm("Signing up will erase all your data, are you sure you want to sign up ?")

              const perm = await Filesystem.requestPermissions();
              if (perm.publicStorage !== 'granted') {
                alert("No permissions")
                return;
              }
              if (response) {

                try {

                  const files = await Filesystem.readdir({
                    path: '.',
                    directory: Directory.Documents
                  });

                  const deletePromises = files.files.map((file) => {
                    return Filesystem.deleteFile({
                      path: file.name,
                      directory: Directory.Documents
                    });
                  });
                  var n = deletePromises.length / 2;
                  if (n === 1) alert(`Deleting ${n} photo`);
                  else alert(`Deleting all ${n} photos`);
                  await Promise.all(deletePromises);
                } catch (err) {

                }


                await Filesystem.writeFile({
                  path: ".user_picSafe_cred.txt",
                  data: btoa(JSON.stringify({ name: name, email: email, password: password })),
                  directory: Directory.Data
                });

                alert("You can log in now, dont forget your password, it is very unlikely to be recovered");
                setTimeout(() => navigate("/login"), 0);
                return;
              }

            } catch (err) {
              console.log(err)
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

            <p style={{ color: "black" }}>Have an account? <a style={{ color: "blue" }} onClick={() => navigate("/")}>Sign In</a></p>
          </div>
        </IonList>
      </center>
    </IonPage>
  )
}

export default Login