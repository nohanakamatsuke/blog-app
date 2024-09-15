// import { type Author } from "./author";

// export type Post = {
//   id: string;
//   slug: string;
//   title: string;
//   date: string;
//   last_edited_time: string;
//   properties: {
//     slug?: {
//       rich_text?: Array<{
//         plain_text: string;
//       }>;
//     };
//   };
//   coverImage?: string;
//   author?: Author;
//   excerpt?: string;
//   content?: string;
//   preview?: boolean;
// };

// interfaces/post.ts

import { type Author } from "./author";

interface NotionProperty {
  id: string;
  type: string;
}

interface NotionTitleProperty extends NotionProperty {
  type: "title";
  title: Array<{
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: null | string;
  }>;
}

interface NotionRichTextProperty extends NotionProperty {
  type: "rich_text";
  rich_text: Array<{
    type: string;
    text: {
      content: string;
      link: null | string;
    };
    annotations: {
      bold: boolean;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
      code: boolean;
      color: string;
    };
    plain_text: string;
    href: null | string;
  }>;
}

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  last_edited_time: string;
  properties: {
    Name?: NotionTitleProperty;
    name?: NotionTitleProperty;
    slug?: NotionRichTextProperty;
    Slug?: NotionRichTextProperty;
    [key: string]: NotionProperty | undefined;
  };
  coverImage?: string;
  author?: Author;
  excerpt?: string;
  content?: string;
  preview?: boolean;
};
