import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useEffect, useRef, useState } from 'react';
import { Share } from '@capacitor/share';
import './App.css';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import PickUp from './PickUp';

function App() {
  const [file, setFile] = useState(null);
  const [ringing, setRinging] = useState(false);
  const [selected, setSelected] = useState(false);
  // const audioRef = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  const audioRef = new Audio('/ringtone.mp3');

  const pickFiles = async () => {
    try {
      const result = await FilePicker.pickFiles({
        multiple: true,
        types: ['audio/*'],
      });
      setFile(result.files[0]);
      setSelected(true)

    } catch (err) {
      console.log("User cancelled or error", err);
    }
  };

  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function shareFile() {
    try {
      const result = await FilePicker.pickFiles({
        types: ['audio/*'],
      });

      const file = result.files[0];

      if (navigator.share && navigator.canShare?.({ files: [file.blob] })) {
        alert("Web");
        await navigator.share({
          title: 'Audio File',
          files: [file.blob],
        });
      } else {
        alert("Mobile");
        alert(file.blob)

        const base64 = await blobToBase64(file.blob);

        await Share.share({
          title: 'Audio File',
          url: base64,
        });
      }

    } catch (err) {
      alert(err);
    }
  }


  async function requestAndScheduleNotification() {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display === 'granted')
      console.log('Notification permission granted');
    else {
      console.log('Notification permission denied');
      return;
    }

    // Scheduling a notification
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Hello!',
          body: 'This is a test notification from your app.',
          id: 1,
          schedule: { at: new Date(new Date().getTime() + 5000) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null,
        },
      ],
    });

    console.log('Notification scheduled');
  }

  const ringingRef = useRef(false);


  useEffect(() => {
    const register = async () => {
      await PushNotifications.createChannel({
        id: 'incoming_call_channel',
        name: 'Incoming Calls',
        description: 'Incoming call notifications',
        importance: 5,
        sound: 'default',
        vibration: true,
      });
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive !== 'granted') {
        alert('Push permission denied');
        return;
      }

      await PushNotifications.register();
    };

    register();

    const regListener = PushNotifications.addListener('registration', async (token) => {
      try {
        await Share.share({
          title: 'Check this out',
          text: token.value,
          dialogTitle: 'Share via',
        });
      } catch (err) {
        alert('Error sharing: ' + err);
      }
    });


    const notifListener = PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      if (notification.data?.type === 'incoming_call' && !ringingRef.current) {


        await LocalNotifications.schedule({
          notifications: [
            {
              id: 1,
              title: notification.data.caller_name || 'Incoming Call',
              body: 'Tap to answer',
              sound: 'default',
              channelId: 'incoming_call_channel',
            },
          ],
        });


        setRinging(true);

        ringingRef.current = true;
        audioRef.loop = true;
        audioRef.play().catch(err => alert(err));
        setTimeout(() => {
          audioRef.pause();
          audioRef.currentTime = 0;
          ringingRef.current = false;
        }, 30000);

      }
    });


    const actionListener = PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      alert(JSON.stringify(notification));

      audioRef.pause();
      audioRef.currentTime = 0;
      ringingRef.current = false;

    });

    return () => {
      regListener.remove();
      notifListener.remove();
      actionListener.remove();
    };
  }, []);

  return (
    <div className="App">
      <p>Hello World</p>
      <button onClick={() => pickFiles()}>Select</button>
      {selected && <audio controls autoPlay src={URL.createObjectURL(file.blob)}>Song</audio>}
      <button onClick={async () => {
        await Filesystem.writeFile({
          path: 'hello.txt',
          data: 'Hello from Capacitor!',
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        }).then(() => console.log("written"));
      }}>Write</button>
      <button onClick={async () => {
        const contents = await Filesystem.readFile({
          path: 'hello.txt',
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        });
        console.log(contents.data);
      }}>Read</button>
      <button onClick={async () => {

        shareFile();
      }}>Share</button>
      <button onClick={() => {
        requestAndScheduleNotification()
      }}>Notify</button>
      {ringing && <PickUp audRef={audioRef} ringRef={ringingRef} ring={setRinging} />}
    </div >
  );
}

export default App;




