export default {
   expo: {
    name: "SafeHome",
    slug: "temp-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.safehome.app",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },  
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-secure-store",
      [
        "expo-notifications",
        {
          color: "#1d9e75",
        },
      ],
    ],
    extra: {
      apiUrl: process.env.API_URL || "https://safehome-api.onrender.com",
      eas: {
        projectId: "c4746a36-4dde-4b65-be26-03984aff10ab",
      },
    },
  },
};
