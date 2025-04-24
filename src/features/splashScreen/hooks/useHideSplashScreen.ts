import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';

const useHideSplashScreen = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    // hide splash AFTER the auth check otherwise there is a slight UI glitch
    hideSplashScreen();
  }, []);
};

export default useHideSplashScreen;