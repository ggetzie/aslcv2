# Changes to start working again in 2023 on Windows

- Increase Java memory limit
   Added line `org.gradle.jvmargs=-Xmx4096M` to android/gradle.properties

- ERR_OSSL_EVP_UNSUPPORTED when running metro
  Set environment variable `$Env:NODE_OPTIONS="--openssl-legacy-provider"

- Execution failed for task ':app:checkDebugDuplicateClasses'.
  Add `implementation 'org.jetbrains.kotlin:kotlin-reflect:1.8.0'` to dependencies in android/app/build.gradle

- minSdkVersion 16 -> 21
  Override in manifest file

- AsyncStorageModule.java uses or overrides a deprecated API.

- AAPT: error: resource android:attr/lStar not found.
  Upgraded react native to 0.63.5 per [this issue](https://github.com/facebook/react-native/issues/35210) 

  # Changes to start working in 2024

  Updated react native to 0.74 + all dependencies

  hermesEnabled=true in app:gradle.properties
  https://stackoverflow.com/questions/57714430/could-not-get-unknown-property-enablehermes-for-object-of-type-org-gradle-api