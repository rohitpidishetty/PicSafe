import { Directory, Filesystem } from '@capacitor/filesystem'
import { IonHeader, IonImg, IonLoading, IonPage, IonTitle, IonToast, IonToolbar, useIonLoading, IonFooter, IonButton, IonButtons, IonCard } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import "./Layout.css";
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

function Storage() {

  const cachedImages = { current: null };

  const [images, setImages] = useState([]);
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);

  const navigate = useNavigate();
  const [present, dismiss] = useIonLoading();


  function display(image, name) {
    navigate("/picture", { state: { image: image, name: name } });
  }

  async function fetchFiles() {
    if (cachedImages.current) {
      setImages(cachedImages.current);
      setLoading(false);
      return;
    }

    try {
      const dir = await Filesystem.readdir({
        path: '',
        directory: Directory.Documents
      });
      var temp = [];
      for (const fileObject of dir.files) {
        if (fileObject.name.endsWith('.sgpic') && fileObject.name.startsWith('.')) {
          const fileContent = await Filesystem.readFile({
            path: fileObject.uri,

          });
          const imageUrl = `data:image/png;base64,${fileContent.data}`;
          temp.push({ img: imageUrl, tstamp: fileObject.ctime, name: fileObject.name });
        }
      }
      temp.sort((a, b) => b.tstamp - a.tstamp);
      cachedImages.current = temp;
      // setImages(temp);
      // setState(true);
      return temp;
    } catch (err) {
      return 'Error fetching files:' + err;
    }


  }



  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;

      fetchFiles().then((images) => {
        setImages(images);
        setState(true);
        setLoading(false);
      }).catch((err) => {
        alert(err)
      });

    }
  }, [])
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

      <center>

        {loading && <img style={{
          textAlign: "center",
          width: "10%"
        }} src='loader.svg' />}
      </center>
      <div className='grid-view'>
        <IonLoading message="Loading images" />
        {!loading && state && images.map((image, key) => <IonImg onClick={async (e) => {
          e.target.classList.add('zoom')
          setTimeout(() => {
            e.target.classList.toggle('zoom');
          }, 1000)
          await new Promise((res, rej) => setTimeout(res, 500));
          display(image.img, image.name);
          // console.log(image)
        }} className='image' key={key} src={image.img} />)}
        {!loading && state && images.length === 0 && <center>

          <IonCard className='info' style={{
            width: "70%",
            position: "unset"
          }}>
            <p style={{
              padding: "2%",
              fontSize: "1.2rem"
            }}>Your gallery is empty</p>
          </IonCard>
        </center>}

      </div>

      <IonFooter style={{
        bottom: 0,
        position: "fixed"
      }}>
        <IonToolbar>
          <IonButtons className='bar'>
            <IonButton onClick={() => { navigate("/main") }} className='btn'>
              <FaCamera className='icons' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  )
}

export default Storage