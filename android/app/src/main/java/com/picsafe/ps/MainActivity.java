package com.picsafe.ps;

import static androidx.core.content.ContextCompat.getSystemService;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(
        "incoming_call_channel",
        "Incoming Calls",
        NotificationManager.IMPORTANCE_HIGH
      );
      channel.setDescription("Notifications for incoming calls");
      channel.enableLights(true);
      channel.enableVibration(true);
      getSystemService(NotificationManager.class).createNotificationChannel(
        channel
      );
    }
  }
}
