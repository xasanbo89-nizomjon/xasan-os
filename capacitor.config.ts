export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: Record<string, any>;
  backgroundColor?: string;
  plugins?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: "com.xasan.os.ultimate",
  appName: "XASAN OS Ultimate",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  backgroundColor: "#080D0B",
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#080D0B",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#080D0B",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
