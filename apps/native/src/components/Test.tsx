import { Button } from "@repo/ui";

export const Test = () => {
  return (
    <Button
      onClick={() => {
        console.log("Pressed!");
        alert("Pressed!");
      }}
      text="Boop"
    />
  );
};
