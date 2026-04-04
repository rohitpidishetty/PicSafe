import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonBadge, IonButton, IonButtons, IonCard, IonFooter, IonHeader, IonImg, IonItemOption, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import "./Layout.css";
import { Directory, Filesystem } from '@capacitor/filesystem';

import { Geolocation } from '@capacitor/geolocation';
import { GrGallery } from 'react-icons/gr';
import { FaCamera, FaLock } from 'react-icons/fa';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

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
      const file = await Filesystem.readFile({
        path: '.user_picSafe_cred.txt',
        directory: Directory.Data
      });
    }
    catch (err) {
      const res = window.confirm("It is recommended to sign-up first & sign-in and then try taking pictures");
      if (res) {
        navigation("/signup")
        return;
      }
    }

    try {

      const response = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });



      if (response.base64String !== null && response.base64String.length !== 0) {
        try {
          if (Capacitor.isNativePlatform()) {
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
          }
          else {
            const coords = { latitude: null, longitude: null };
            navigator.geolocation.getCurrentPosition(async (c) => {
              coords.latitude = c.coords.latitude;
              coords.longitude = c.coords.longitude;
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
            })
          }




          // navigation("/gallery-store")
        } catch (err) {
          console.log(err)
          alert("Try again");
        }
      }

    } catch (err) {

    }
  }



  async function lock() {
    await Preferences.set({ key: "lock", value: "true" });
    try {
      const file = await Filesystem.readFile({
        path: '.user_picSafe_cred.txt',
        directory: Directory.Data
      });
      navigation("/login")
    }
    catch (err) {
      navigation("/signup")
    }
  }

  useEffect(() => {
    async function locked() {
      let lock = await Preferences.get({ key: "lock" });
      if (lock.value === null || lock.value === undefined) {
        // No lock, setting lock status to FALSE
        await Preferences.set({ key: "lock", value: "false" });
      }
      lock = await Preferences.get({ key: "lock" });
      if (lock.value === 'true') setTimeout(() => navigation("/login"), 0);
    }
    locked();
  }, [])


  return (
    <IonPage>
      <IonHeader >
        <IonToolbar style={{
          '--background': '#3880FF',
          '--color': 'white'
        }}>
          <IonTitle >
            PicSafe
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <center>
        <img style={{
          width: "92%"
        }} src='./image.png' />

        <IonCard className='info' style={{
          width: "70%",
          position: "unset"
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

              <GrGallery className='icons' />
            </IonButton>
            <IonButton onClick={clickPhoto} className='btn'>
              <FaCamera className='icons' />
            </IonButton>
            <IonButton onClick={lock} className='btn'>
              <FaLock className='icons' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage >
  )
}

export default Main