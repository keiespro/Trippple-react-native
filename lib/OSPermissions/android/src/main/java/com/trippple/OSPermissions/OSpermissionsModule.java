package com.trippple.OSPermissions;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OSPermissionsModule extends ReactContextBaseJavaModule {


  public OSPermissionsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "OSPermissions";
  }

  @ReactMethod
  public Boolean canUseLocation() {
    return false;
  }
}
