package com.trippple.RNHotline;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.freshdesk.hotline.FaqOptions;
import com.freshdesk.hotline.Hotline;
import com.freshdesk.hotline.HotlineConfig;
import com.freshdesk.hotline.HotlineUser;
import com.freshdesk.hotline.exception.HotlineInvalidUserPropertyException;

import java.util.HashMap;
import java.util.Map;

//import com.facebook.react.bridge.Bundle;

public class RNHotlineModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext reactContext;

    public RNHotlineModule(ReactApplicationContext reactContext) {

        super(reactContext);

        this.reactContext = reactContext;

        HotlineConfig hConfig = new HotlineConfig("f54bba2a-84fa-43c8-afa9-098f3c1aefae","fba1b915-fa8b-4c24-bdda-8bac99fcf92a");

        hConfig.setVoiceMessagingEnabled(true);
        hConfig.setCameraCaptureEnabled(true);
        hConfig.setPictureMessagingEnabled(true);

        Hotline.getInstance(getReactApplicationContext()).init(hConfig);

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "RNHotline";
    }


    @ReactMethod
    public void setUser(final String userId, final String firstname, final String phone, final String email, final ReadableMap readableMap, final Promise promise) throws HotlineInvalidUserPropertyException {
        HotlineUser hlUser=Hotline.getInstance(getReactApplicationContext()).getUser();
        hlUser.setName(firstname);
        hlUser.setEmail(email);
        hlUser.setExternalId(userId);
        Hotline.getInstance(getReactApplicationContext()).updateUser(hlUser);

        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        Map<String, String> userMeta = new HashMap<>();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);
            switch (type) {

                case String:
                    userMeta.put(key, readableMap.getString(key));

                default:
                    throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
            }

        }

        Hotline.getInstance(getReactApplicationContext()).updateUserProperties(userMeta);
    }


    @ReactMethod
    public void logOut( ) {

        Hotline.clearUserData(getReactApplicationContext());

    }


    @ReactMethod
    public void showFAQs() {
        FaqOptions faqOptions = new FaqOptions()
                .showFaqCategoriesAsGrid(true)
                .showContactUsOnAppBar(true)
                .showContactUsOnFaqScreens(false)
                .showContactUsOnFaqNotHelpful(false);


        Hotline.showFAQs(getReactApplicationContext(), faqOptions);
    }

    @ReactMethod
    public void showConversations() {

        Hotline.showConversations(getReactApplicationContext());
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    public void doIt(Promise promise) {
//
//        PackageManager manager = reactContext.getPackageManager();
//        List<ResolveInfo> list = manager.queryIntentActivities(1, 0);
//
//        if (list == null || list.size() == 0) {
//            promise.resolve("not_available");
//            return;
//        }

        promise.resolve("ok");
    }

    // You can get the result here
//   @Override
//   public void onActivityResult(final int requestCode, final int resultCode, final Intent intent) {
////     if (requestCode == OPEN_HOTLINE_REQUEST) {
////       if (mHotlinePromise != null) {
////         if (resultCode == Activity.RESULT_CANCELED) {
////           mHotlinePromise.reject(E_HOTLINE_CANCELLED, "Image picker was cancelled");
////         } else if (resultCode == Activity.RESULT_OK) {
////           Uri uri = intent.getData();
////
////           if (uri == null) {
////             mHotlinePromise.reject(E_NO_OPEN_DATA_FOUND, "No image data found");
////           } else {
////             mHotlinePromise.resolve(uri.toString());
////           }
////         }
//
//         mHotlinePromise = null;
//       }
//     }
//   }
}
