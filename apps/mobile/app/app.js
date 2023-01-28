/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@notesnook/theme";
import NetInfo from "@react-native-community/netinfo";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { withErrorBoundry } from "./components/exception-handler";
import GlobalSafeAreaProvider from "./components/globalsafearea";
import Launcher from "./components/launcher";
import { useAppEvents } from "./hooks/use-app-events";
import { ApplicationHolder } from "./navigation";
import Notifications from "./services/notifications";
import SettingsService from "./services/settings";
import { TipManager } from "./services/tip-manager";
import { useThemeStore } from "./stores/use-theme-store";
import { useUserStore } from "./stores/use-user-store";
//import { BackgroundSync } from "./services/background-sync";
NetInfo.configure({
  reachabilityUrl: "https://notesnook.com",
  reachabilityTest: (response) => {
    if (!response) return false;
    return response?.status >= 200 && response?.status < 300;
  }
});

SettingsService.init();
SettingsService.checkOrientation();
const App = () => {
  const [colorScheme, darkTheme, lightTheme] = useThemeStore((state) => [
    state.colorScheme,
    state.darkTheme,
    state.lightTheme
  ]);
  useAppEvents();
  const [init, setInit] = useState(false);
  useEffect(() => {
    let { appLockMode } = SettingsService.get();
    if (appLockMode && appLockMode !== "none") {
      useUserStore.getState().setVerifyUser(true);
    }
    //BackgroundSync.start();
    setInit(true);
    setTimeout(async () => {
      SettingsService.onFirstLaunch();
      await Notifications.get();
      if (SettingsService.get().notifNotes) {
        Notifications.pinQuickNote(true);
      }
      TipManager.init();
    }, 100);
  }, []);
  return (
    <ThemeProvider
      value={{
        theme: colorScheme === "dark" ? darkTheme : lightTheme,
        setTheme: () => null
      }}
    >
      <View
        style={{
          height: "100%",
          width: "100%"
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -1
          }}
          pointerEvents="none"
        >
          <SafeAreaProvider>
            <GlobalSafeAreaProvider />
          </SafeAreaProvider>
        </View>

        <GestureHandlerRootView
          style={{
            height: "100%",
            width: "100%"
          }}
        >
          <ApplicationHolder />
          {init && <Launcher />}
        </GestureHandlerRootView>
      </View>
    </ThemeProvider>
  );
};

export default withErrorBoundry(App, "App");
