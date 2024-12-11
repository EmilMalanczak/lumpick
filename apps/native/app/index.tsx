import { StyleSheet, View } from "react-native";

import { MyButton } from "@lumpick/ui";

export default function HomeScreen() {
  return (
    <View style={styles.wrapper}>
      <MyButton text="hello world" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
