package com.trippple.OSPermissions;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class OSPermissionsModule extends ReactContextBaseJavaModule {


  public OSPermissionsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "OSPermissions";
  }

  @ReactMethod
  public void canUseLocation() {
    return false
  }
}
