import React, { useEffect, useState } from 'react'
import "./pin.css";
import { IonBadge, IonButton, IonButtons, IonCard, IonFooter, IonHeader, IonImg, IonItemOption, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useNavigate } from 'react-router-dom';
import { FaBackspace } from 'react-icons/fa';
import { Preferences } from '@capacitor/preferences';

setupIonicReact({
  mode: 'md'
});

function PinLock() {
  const [pin, setPin] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    async function permit() {
      const perm = await Filesystem.requestPermissions();
      if (perm.publicStorage !== 'granted') {
        alert("No permissions")
        return;
      }
    }
    permit();
  }, []);


  async function makeSureLength(n) {
    pin.push(n);
    setPin((pin) => [...pin]);
    if (pin.length === 5) {
      try {
        const file = await Filesystem.readFile({
          path: '.user_picSafe_cred.txt',
          directory: Directory.Data
        });

        const user = JSON.parse(atob(file.data))
        console.log(JSON.parse(user.pin), pin)
        var temp = JSON.parse(user.pin);
        var state = true;
        for (var i = 0; i < 6; i++) {
          if (temp[i] !== pin[i]) state = false;
        }
        if (!state) { alert("Wrong key"); setPin([]); return; }
        await Preferences.set({ key: "lock", value: "false" });
        setTimeout(() => navigate("/main"), 0);
      } catch (err) {
        alert("Try again, or sign up again");
      }
      return;
    }
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

export default PinLock