import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {  IonButton, IonButtons, IonCard, IonFooter, IonHeader,   IonPage,   IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import "./Layout.css";
import { Directory, Filesystem } from '@capacitor/filesystem';

import { Geolocation } from '@capacitor/geolocation';

setupIonicReact({
  mode: 'md'
});


function Main() {
  const navigation = useNavigate();

  async function getLocation() {
    try {
      const perm = await Geolocation.requestPermissions();
      if (perm.location === "granted") {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
        return position.coords;
      }
      else return null;
    } catch (err) {
      return null;
    }
  }

  async function clickPhoto() {

    try {

      const response = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      if (response.base64String !== null && response.base64String.length !== 0) {
        try {

          const coords = await getLocation();
          const payload = {
            lat: coords?.latitude || null,
            lon: coords?.longitude || null,
            timestamp: Date.now()
          }
          const UID = uuid();
          await Filesystem.writeFile({
            path: `.${UID}.sgpic`,
            data: response.base64String,
            directory: Directory.Documents
          })

          await Filesystem.writeFile({
            path: `.${UID}.meta`,
            data: btoa(JSON.stringify(payload)),
            directory: Directory.Documents
          })
          alert("Saved");


          navigation("/gallery-store")
        } catch (err) {
          console.log(err)
          alert("Try again");
        }
      }

    } catch (err) {

    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            PicSafe
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <center>

        <IonCard style={{
          width: "70%"
        }}>
          <p style={{
            padding: "2%",
            fontSize: "1.2rem"
          }}>Welcome to PicSafe
            Capture moments, keep them hidden.
            PicSafe lets you click images and store them securely, away from prying eyes.
            Your photos stay private, organized, and accessible only to you, a personal space for everything you want to keep confidential.</p>
        </IonCard>
      </center>
      <IonFooter style={{
        bottom: 0,
        position: "fixed"
      }}>
        <IonToolbar>
          <IonButtons className='bar'>
            <IonButton onClick={() => navigation("/gallery-store")} className='btn'>
              <ion-icon name="image-outline"></ion-icon>
            </IonButton>
            <IonButton onClick={clickPhoto} className='btn'>
              <ion-icon name="camera-outline"></ion-icon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage >
  )
}

export default Main
