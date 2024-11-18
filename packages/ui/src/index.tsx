import { Text, View } from "react-native";

export * from "./utils/style";

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export function Button() {
  return (
    <View>
      <Text>Click me</Text>
    </View>
  );
}
