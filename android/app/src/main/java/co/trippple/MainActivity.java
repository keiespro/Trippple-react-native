package co.trippple;

import android.content.Intent;
import android.os.Bundle;

import com.cboy.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.uxcam.UXCam;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Trippple";
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//      SplashScreen.hide(this);  // here
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here


        super.onCreate(savedInstanceState);
    }



    @Override
    public void onNewIntent (Intent intent) {
//        SplashScreen.hide(this);  // here
        setIntent(intent);

        super.onNewIntent(intent);
    }
}
