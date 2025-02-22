import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { settings } from "~constants/settings";
import superjson from "superjson";

import type { AppRouter } from "@lumpick/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@lumpick/api";

type TRPCProviderProps = {
  children: ReactNode;
};

export const TRPCProvider = ({ children }: TRPCProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: settings.apiUrl,
          headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");

            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};
