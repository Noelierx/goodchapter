import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Book from "./Book";

export default {
  title: "Components/Book",
  component: Book,
  parameters: {
    docs: {
      description: {
        component: "Display Book",
      },
    },
  },
} as ComponentMeta<typeof Book>;

export const Default: ComponentStory<typeof Book> = () => (
  <Book
    title="The Great Gatsby"
    author="F. Scott Fitzgerald"
    description="The Great Gatsby is a novel by American author F. Scott Fitzgerald. First published by Charles Scribner's Sons in April 1925, the novel takes place on Long Island's North Shore and in New York City during the summer of 1922."
    isbn="9780743273565"
    cover="https://m.media-amazon.com/images/I/41yJ75gpV-L._SY346_.jpg"
  />
);
