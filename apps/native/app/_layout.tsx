import "~/scripts/polyfills";
import "../global.css";

import React, { Suspense } from "react";
import { Stack } from "expo-router";
import { TRPCProvider } from "~utils/trpc";

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

export default RootLayout;
