# Changes to start working again in 2023 on Windows

- Increase Java memory limit
   Added line `org.gradle.jvmargs=-Xmx4096M` to android/gradle.properties

- ERR_OSSL_EVP_UNSUPPORTED when running metro
  Set environment variable `$Env:NODE_OPTIONS="--openssl-legacy-provider"

- Execution failed for task ':app:checkDebugDuplicateClasses'.
  Add `implementation 'org.jetbrains.kotlin:kotlin-reflect:1.8.0'` to dependencies in android/app/build.gradle