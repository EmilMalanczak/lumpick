import { type FC } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export type MyButtonProps = {
  onPress?: () => void;
  text: string;
};

export const MyButton: FC<MyButtonProps> = ({ onPress, text }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

MyButton.displayName = "MyButton";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "blue",
  },
  text: { color: "yellow" },
});
