import { Directory, Filesystem } from '@capacitor/filesystem'
import { IonHeader, IonImg, IonLoading, IonPage, IonTitle, IonToast, IonToolbar, useIonLoading, IonFooter, IonButton, IonButtons } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import "./Layout.css";
import { useNavigate } from 'react-router-dom';

function Storage() {

  const [images, setImages] = useState([]);
  const [state, setState] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [present, dismiss] = useIonLoading();


  function display(image, name) {
    navigate("/picture", { state: { image: image, name: name } });
  }

  async function fetchFiles() {

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
      // setImages(temp);
      // setState(true);
      return temp;
    } catch (err) {
      return 'Error fetching files:' + err;
    }


  }


  useEffect(() => {

    fetchFiles().then((images) => {
      setImages(images);
      setState(true);
      setLoading(false);
    }).catch((err) => {
      alert(err)
    });

  }, [])
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

      </div>

      <IonFooter style={{
        bottom: 0,
        position: "fixed"
      }}>
        <IonToolbar>
          <IonButtons className='bar'>
            <IonButton onClick={() => { navigate("/main") }} className='btn'>
              <ion-icon name="camera-outline"></ion-icon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>

    </IonPage>
  )
}

export default Storage