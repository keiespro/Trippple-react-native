package co.trippple;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.trippple.RNUXCam.RNUXCamPackage;

import com.cboy.rn.splashscreen.SplashScreenReactPackage;

import com.cmcewen.blurview.BlurViewPackage;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.keychain.KeychainPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import com.oblador.vectoricons.VectorIconsPackage;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import co.trippple.RNHotline.RNHotline;



import java.util.Arrays;
import java.util.List;
import javax.annotation.Nullable;

import io.fabric.sdk.android.Fabric;

public class MainApplication extends MultiDexApplication implements ReactApplication {


  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
      return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
      public String getJSMainModuleName() {
        return "index.android";
      }

      @Override
      public @Nullable String getBundleAssetName() {
        return "main.android.jsbundle";
      }

      @Override
      public boolean getUseDeveloperSupport() {
        return true;
      }




    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativePushNotificationPackage(),
            new KeychainPackage(),
            new RNNetworkInfoPackage(),
            new RNHotline(),
            new RNGeocoderPackage(),
            new ReactNativePermissionsPackage(),
            new RNMixpanel(),
            new RNUXCamPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new GoogleAnalyticsBridgePackage(),
            new FIRMessagingPackage(),
            new FBSDKPackage(mCallbackManager),
            new RNDeviceInfo(),
            new ReactNativeContacts(),
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
