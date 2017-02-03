fastlane documentation
================
# Installation
```
sudo gem install fastlane
```
# Available Actions
## Android
### android submit
```
fastlane android submit
```
Build android release and upload to google play for production
### android bump
```
fastlane android bump
```
increment version number in app/build.gradle
### android beta
```
fastlane android beta
```
Build android release and upload to google play as a beta

----

## iOS
### ios certs
```
fastlane ios certs
```
This will make sure the profiles and certificates are up to date
### ios bump
```
fastlane ios bump
```
Version bump
### ios beta
```
fastlane ios beta
```
Submit a new Beta Build to Apple TestFlight
### ios submit
```
fastlane ios submit
```
Deploy a new version to the App Store
### ios upload
```
fastlane ios upload
```

### ios pushdebug
```
fastlane ios pushdebug
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
