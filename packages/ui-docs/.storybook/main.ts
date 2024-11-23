import { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["../src/**/*.stories.?(js|jsx|ts|tsx)"],
  addons: [
    /**
     * Adjust your components props in realtime
     */
    "@storybook/addon-ondevice-controls",
    /**
     * Mock onPress calls with actions that will log information in the actions tab
     */
    "@storybook/addon-ondevice-actions",
    /**
     * Add some markdown to your stories to help document their usage
     */
    "@storybook/addon-ondevice-notes",
    /**
     * Change the background of storybook to compare the look of
     * component against different backgrounds
     */
    "@storybook/addon-ondevice-backgrounds",
  ],
};

export default main;
