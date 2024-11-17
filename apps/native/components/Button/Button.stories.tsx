import type { Meta, StoryObj } from "@storybook/react";
import { withClassName } from "~storybook/decorators";

import { MyButton } from "./Button";

const meta: Meta<typeof MyButton> = {
  title: "MyButton",
  component: MyButton,
  argTypes: {
    onPress: { action: "pressed the button" },
  },
  args: {
    text: "Hello world",
  },
  decorators: [
    withClassName("text-white flex-1 justify-center p-4"),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const AnotherExample: Story = {
  args: {
    text: "Another example",
  },
};
