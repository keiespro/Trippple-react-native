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




## Atom/Nuclide

Recommend installing these Atom plugins:

* [Nuclide](https://atom.io/packages/nuclide)
* [Atom XCode](https://atom.io/packages/atom-xcode)
* [language-babel](https://atom.io/packages/language-babel)
* [react](https://atom.io/packages/react)

You can use React Native packager && React Native Inspector in Atom
