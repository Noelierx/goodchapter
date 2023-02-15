import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import NoResults from "./NoResults";

export default {
  title: "Components/NoResults",
  component: NoResults,
  parameters: {
    docs: {
      description: {
        component: "Display NoResults when no search result",
      },
    },
  },
} as ComponentMeta<typeof NoResults>;

export const Default: ComponentStory<typeof NoResults> = () => <NoResults />;
