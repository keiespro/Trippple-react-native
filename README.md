#Instructions

Make sure you have react-native-cli and yarn

 ```
 npm install -g react-native-cli yarn
 ```

Install npm packages

```
yarn
```

Install Cocoapods

```
ruby -v #should be > 2.3
cd ios
pod install
```

## FB SDK

ios

Download the facebook ios sdk and unzip it into ~/Documents/FacebookSDK/  !important;
https://developers.facebook.com/docs/ios/getting-started/


android


##Running


```
# Run with sudo (only once, to create the necessary paths)
sudo react-native run-ios
```


```
#Run normally
react-native run-ios
react-native run-android
```


## Build on your phone

* Open ios/Trippple.xcworkspace
* Select your device in the dropdown and hit play.
* The packager has to be running (see above)

##Dev Menu
- Simulator: Cmd+D
- Phone: Shake
- Hot reload
- Debug JS Remotely


## Debugging

I highly recommend using React Native Debugger:

```
brew update && brew cask install react-native-debugger
```


## Fastlane
```
cd ios
fastlane beta
```

## Android


### Enable dev mode:

1 Open Settings > About device.
2 Then tap “Build number” seven times to enable Developer options
3 Go back to Settings menu and now you'll be able to see “Developer options” there.

### Install APK:

1 Download then open apk
2 It will ask you to allow sideloading apps in settings, do so, open apk again
3 App installs

### Location Faking
1 Go to google play and there are a ton of apps that do this for you
2 I am using one called Mockation
3 Go to Settings -> Developer options -> Select mock location app
4 Select the app you installed. Then open that app and pick a location.


## Atom/Nuclide

Recommend installing these Atom plugins:

* [language-babel](https://atom.io/packages/language-babel)
