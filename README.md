# Archaeological Survey Location Collector: Version 2

This is React Native mobile app to upload Archaeological Survey data to a remote server via a REST API. The backend server portion is a Django app residing in the repository [here](https://github.com/ggetzie/aslcv2_be). 

Note that while React Native is theoretically cross-platform, this app has only been tested and built for Android devices.

## Build instructions

1. Open the android folder with Android Studio
2. Make sure the build variant is set to "release"
3. From the top menu go to Build > Build APK
4. Find the APK file under `android/app/build/outputs/apk/release`

This app is not hosted on the Google Play or any other app store, so you must side-load the APK to your phone.