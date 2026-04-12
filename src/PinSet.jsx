import React, { useState } from 'react'
import "./pin.css";
import { IonBadge, IonButton, IonButtons, IonCard, IonFooter, IonHeader, IonImg, IonItemOption, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useNavigate } from 'react-router-dom';
import { FaBackspace } from 'react-icons/fa';

setupIonicReact({
  mode: 'md'
});

function PinSet() {
  const [pin, setPin] = useState([]);
  const navigate = useNavigate();
  function makeSureLength(n) {
    if (pin.length >= 5) return;
    setPin((pin) => [...pin, n])
  }
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
      <div>
        <div className='controls'>

          <button onClick={async () => {
            if (pin.length !== 5) return;
            try {

              const response = window.confirm("Will erase all your data, are you sure you want to proceed ?")

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
                } catch (err) { }

                await Filesystem.writeFile({
                  path: ".user_picSafe_cred.txt",
                  data: btoa(JSON.stringify({ pin: JSON.stringify(pin) })),
                  directory: Directory.Data
                });
                alert("You can log in now, dont forget your pin, it is very unlikely to be recovered");
                setTimeout(() => navigate("/pin"), 0);
                return;
              }

            } catch (err) {
              console.log(err)
              alert("Retry logging in later")
            }


          }}>Save</button>
          <button onClick={() => { setPin([]) }}>Clear</button>
          <button onClick={() => { pin.pop(); setPin((pin) => [...pin]) }}><FaBackspace /></button>
        </div>
        <div className='pin'>

          {
            pin.length !== 0 && pin.map((e, i) => {
              return <p key={i}>{e}</p>
            })
          }
        </div>
        <div className='dial'>
          <table>
            <tr>
              <td><button onClick={() => { makeSureLength(1); }}>1</button></td>
              <td><button onClick={() => { makeSureLength(2); }}>2</button></td>
              <td><button onClick={() => { makeSureLength(3); }}>3</button></td>
            </tr>
            <tr>
              <td><button onClick={() => { makeSureLength(4); }}>4</button></td>
              <td><button onClick={() => { makeSureLength(5); }}>5</button></td>
              <td><button onClick={() => { makeSureLength(6); }}>6</button></td>
            </tr>
            <tr>
              <td><button onClick={() => { makeSureLength(7); }}>7</button></td>
              <td><button onClick={() => { makeSureLength(8); }}>8</button></td>
              <td><button onClick={() => { makeSureLength(9); }}>9</button></td>
            </tr>
            <tr>
              <td></td>
              <td><button onClick={() => { makeSureLength(0); }}>0</button></td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </IonPage>
  )
}

export default PinSet