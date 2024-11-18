import React from "react";
import { View } from "react-native";
import { StoryFn } from "@storybook/react";

export { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";

export function withClassName(className: string) {
  return function (Story: StoryFn) {
    return (
      <View className={className}>
        <Story />
      </View>
    );
  };
}
