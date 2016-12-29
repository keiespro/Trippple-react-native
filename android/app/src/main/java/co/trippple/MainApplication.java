package co.trippple;

import android.app.Application;
import android.util.Log;
import android.content.Context;
import android.support.multidex.MultiDexApplication;
import android.support.multidex.MultiDex;

import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import com.facebook.react.ReactApplication;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import co.trippple.RNHotline.RNHotline;
import com.davecoates.rnfirebasebridge.FirebaseBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.chirag.RNMail.RNMail;
import com.oblador.keychain.KeychainPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.rnfs.RNFSPackage;
import org.jall.reactnative.firebase.FirebasePackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import io.fabric.sdk.android.Fabric;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {


  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
      return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativePermissionsPackage(),
            new RNMixpanel(),
            new RNHotline(),
            new FirebaseBridgePackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new ReactNativePushNotificationPackage(),
            new RNMail(),
            new KeychainPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNFSPackage(),
            new FirebasePackage(),
            new FIRMessagingPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNDeviceInfo(),
            new ReactNativeContacts(),
            new RCTCameraPackage(),
            new BlurViewPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }


  @Override
  public void onCreate() {

      super.onCreate();
      mCallbackManager = CallbackManager.Factory.create();
      FacebookSdk.sdkInitialize(getApplicationContext());
      AppEventsLogger.activateApp(this);
      Fabric.with(this, new Answers(), new Crashlytics());
  }


  @Override
  protected void attachBaseContext(Context base) {
      super.attachBaseContext(base);
      MultiDex.install(this);
  }

}
