import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import LoadingSpinner from "./LoadingSpinner";

export default {
  title: "Components/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    docs: {
      description: {
        component: "Display LoadingSpinner when fetching data",
      },
    },
  },
} as ComponentMeta<typeof LoadingSpinner>;

export const Default: ComponentStory<typeof LoadingSpinner> = () => (
  <LoadingSpinner />
);
