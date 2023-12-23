import { useEffect } from "react";
import RNBootSplash from 'react-native-bootsplash';

const useHideSplashScreen = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      await RNBootSplash.hide({ fade: true });
    };

    // hide splash AFTER the auth check otherwise there is a slight UI glitch
    hideSplashScreen();
  }, []);
};

export default useHideSplashScreen;