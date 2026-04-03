import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { IonHeader, IonImg, IonPage, IonTitle, IonToast, IonToolbar, IonFooter, IonItem, IonButton, IonButtons, setupIonicReact } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import "./Layout.css";
import { MdDeleteOutline } from 'react-icons/md';
import { IoIosInformationCircle, IoMdShare } from 'react-icons/io';
import { FaInfo } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { CiCircleInfo } from 'react-icons/ci';

setupIonicReact({
  mode: 'md'
});

function Picture() {
  const location = useLocation();
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [infoAvailable, setInfoAvailable] = useState(false);
  const { image, name } = location.state || {};

  async function details() {
    try {
      const data = await Filesystem.readFile({
        path: name.toString().replace(".sgpic", ".meta"),
        directory: Directory.Documents
      });
      if (data.data.length !== 0) {
        const info = JSON.parse(atob(data.data));
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${info.lat}&lon=${info.lon}`, {
          headers: {
            'User-Agent': 'PicSafe'
          }
        });
        const loc = await res.json();
        setInfo({ city: loc.address.city, country: loc.address.country, road: loc.address.road, state: loc.address.state, tstamp: new Date(info.timestamp).toDateString() });
        setInfoAvailable((infoAvailable) => !infoAvailable);
      }
    }
    catch (err) {
      alert("Please try again later after a while")
    }
  }

  function base64ToFile(base64, fileName, mimeType = 'image/png') {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++)
      byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
  }

  async function share() {
    if (Capacitor.isNativePlatform()) {
      const fileName = `secret_${Date.now()}.png`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: image.split(",")[1],
        directory: Directory.Temporary,
      });
      await Share.share({
        title: 'Image',
        text: 'Secret image!',
        url: savedFile.uri,
      });
    } else {
      const blob = base64ToFile(image.split(",")[1], 'secretPhoto.png', 'image/png');
      if (navigator.share && navigator.canShare?.({ files: [blob] })) {
        await navigator.share({
          title: 'Image',
          text: 'Secret image!',
          files: [blob],
        });
      }
    }
  }

  async function deleteFile() {
    try {
      await Filesystem.deleteFile({
        path: name,
        directory: Directory.Documents
      })
      await Filesystem.deleteFile({
        path: name.replace(".sgpic", ".meta"),
        directory: Directory.Documents
      })
      alert("Deleted");
    } catch (err) { alert("Image not found") }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
          '--background': '#3880FF',
          '--color': 'white'
        }}>
          <IonTitle>
            PicSafe
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {infoAvailable && <div className='info details'>
        <p>{info.city}</p>
        <p>{info.country}</p>
        <p>{info.road}</p>
        <p>{info.state}</p>
        <p>{info.tstamp}</p>
      </div>}

      <IonImg src={image} style={{ marginTop: "2%" }} />

      <IonFooter style={{
        bottom: 0,
        position: "fixed"
      }}>
        <IonToolbar>

          <IonButtons className='bar'>
            <IonButton onClick={deleteFile} className='btn'>
              <MdDeleteOutline className='icons' />
            </IonButton>

            <IonButton onClick={share} className='btn'>
              <IoMdShare className='icons' />
            </IonButton>

            <IonButton onClick={details} className='btn'>

              <IoIosInformationCircle className='icons' />
            </IonButton>

            <IonButton onClick={() => { navigate("/gallery-store") }} className='btn'>
              <IoArrowBackCircleOutline className='icons' />
            </IonButton>
          </IonButtons>

        </IonToolbar>
      </IonFooter>
    </IonPage>
  )
}

export default Picture