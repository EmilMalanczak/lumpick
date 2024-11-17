import "~/scripts/polyfills";
import "../global.css";

import React, { Suspense } from "react";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { TRPCProvider } from "~utils/trpc";

import StorybookUIRoot from "../.storybook";

function RootLayout() {
  return (
    <TRPCProvider>
      <Suspense fallback="Loading">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Suspense>
    </TRPCProvider>
  );
}

let AppEntryPoint = RootLayout;

export const isStoryBookEnabled = Boolean(
  Constants.expoConfig?.extra?.storybookEnabled,
);
/**
 * Storybook is a separate component so when we run it we replace the AppRouter with the Storybook component
 */
if (isStoryBookEnabled) {
  AppEntryPoint = StorybookUIRoot;
}

export default AppEntryPoint;
