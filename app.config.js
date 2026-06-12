export default {
   expo: {
    name: "SafeHome",
    slug: "temp-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.safehome.app",
      googleServicesFile: "./google-services.json", 
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {

    },
    plugins: [
      "expo-secure-store",
      [
        "expo-notifications",
        {
          color: "#1d9e75",
        },
      ],
      "@react-native-community/datetimepicker",
    ],
    extra: {
      apiUrl: process.env.API_URL || "https://safehome-api.onrender.com",
      eas: {
        projectId: "c4746a36-4dde-4b65-be26-03984aff10ab",
      },
    },
  },
};
