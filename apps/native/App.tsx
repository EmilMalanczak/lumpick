import { Test } from "~/components/Test";
import { TRPCProvider } from "~/utils/trpc";

export default function Native() {
  return (
    <TRPCProvider>
      <Test />
    </TRPCProvider>
  );
}
