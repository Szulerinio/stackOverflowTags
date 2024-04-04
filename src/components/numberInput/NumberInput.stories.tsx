import type { Meta, StoryObj } from "@storybook/react";

import { NumberInput } from "./NumberInput";

const meta = {
  component: NumberInput,
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
