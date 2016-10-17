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
import com.freshdesk.hotline.HotlineUser;
import com.freshdesk.hotline.exception.HotlineInvalidUserPropertyException;

import java.util.HashMap;
import java.util.Map;


public class RNHotlineModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext reactContext;

    public RNHotlineModule(ReactApplicationContext reactContext) {

        super(reactContext);

        this.reactContext = reactContext;

        // Add the listener for `onActivityResult`
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "RNHotline";
    }


    @ReactMethod
    public void setUser(final String userId, final String firstname, final String phone, final String email, final ReadableMap readableMap) throws HotlineInvalidUserPropertyException {
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
    public void showFaqs() {
        FaqOptions faqOptions = new FaqOptions()
                .showFaqCategoriesAsGrid(true)
                .showContactUsOnAppBar(true)
                .showContactUsOnFaqScreens(false)
                .showContactUsOnFaqNotHelpful(false);


        Hotline.showFAQs(getReactApplicationContext(), faqOptions);
    }

    @ReactMethod
    public void showConvos() {

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
}
