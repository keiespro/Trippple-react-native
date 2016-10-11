package com.trippple;

import android.app.Application;

import com.chirag.RNMail.RNMail;
import com.cmcewen.blurview.BlurViewPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.rnfs.RNFSPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.trippple.RNHotline.RNHotline;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  private final ReactNativeHost mReactNativeHost;


  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  {
    mReactNativeHost = new ReactNativeHost(this) {
      @Override
      protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }



      @Override
      protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
//            new BaseReactPackage(),
                new ReactNativePushNotificationPackage(),
                new RNMixpanel(),
                new RNMail(),
                new GoogleAnalyticsBridgePackage(),
                new RNFSPackage(),
                new FBSDKPackage(mCallbackManager),
                new RNDeviceInfo(),
                new ReactNativeContacts(),
                new RCTCameraPackage(),
                new BlurViewPackage(),
                new RNHotline()
        );
      }
    };
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }


  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }
}

