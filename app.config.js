export default {
  expo: {
    name: "Golf Match Play",
    slug: "IMPprototype",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    cli: {
      appVersionSource: "version",
    },
    assetBundlePatterns: ["**/*"],
    android: {
      package: "com.IMPprototype.IMPprototype",
      versionCode: 12,
      "permissions": ["POST_NOTIFICATIONS"],
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
    },
    ios: {
      bundleIdentifier: "com.charlie1203.internetmatchplay",
      googleServicesFile: "./GoogleService-Info.plist",
      buildNumber: "1.0.3",
      supportsTablet: true,
      infoPlist: {
        "NSUserNotificationsUsageDescription": "We send a weekly reminder.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      firebaseApiKey: "AIzaSyAXzPEQIqJA9mBoamIjsfAyptIjgpMyo1o",
      firebaseAuthDomain: "internetmatchplay.firebaseapp.com",
      firebaseProjectId: "internetmatchplay",
      firebaseStorageBucket: "internetmatchplay.appspot.com",
      firebaseMessagingSenderId: "1030174523087",
      firebaseAppId: "1:1030174523087:web:00f3a877aabb57628981ba",
      firebaseMeasurementId: "G-B7Q070NLJ3",
      eas: {
        projectId: "ddbc7b69-bd19-494b-84f9-61b43891b302",
      },
    },
    plugins: [["expo-font"]],
    owner: "charlie1203",
    userInterfaceStyle: "light",
  },
};
