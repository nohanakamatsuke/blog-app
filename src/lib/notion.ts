import { config } from "dotenv";
config();
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";
import { NotionToMarkdown } from "notion-to-md";
import { Post } from "@/interfaces/post";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

type Block = BlockObjectResponse | PartialBlockObjectResponse;

// カスタムの NotionProperty 型を定義
type NotionProperty = {
  id: string;
  type: string;
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  date?: { start: string; end: string | null };
  select?: { name: string };
  [key: string]: any;
};

// 日付プロパティ用の型を定義
type DateProperty = NotionProperty & {
  type: "date";
  date: { start: string; end: string | null } | null;
};

interface NotionPostInfo {
  title: string;
  date: string;
  author: string;
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPageContent(pageId: string) {
  const mdblocks = await n2m.pageToMarkdown(pageId, 2);
  return mdblocks;
}
export async function getPageInfo(
  pageId: string | undefined
): Promise<NotionPostInfo> {
  if (!pageId) {
    throw new Error("pageId is undefined or empty");
  }

  try {
    const response = await notion.pages.retrieve({ page_id: pageId });
    const pageObject = response as PageObjectResponse;
    const properties = pageObject.properties;

    const title =
      (properties.title as { title: Array<{ plain_text: string }> }).title[0]
        ?.plain_text || "";
    const date =
      (properties.createdate as { date?: { start: string } })?.date?.start ||
      "";
    const author =
      (properties.author as { select?: { name: string } })?.select?.name || "";

    return { title, date, author };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to retrieve page info for pageId ${pageId}: ${error.message}`
      );
    } else {
      throw new Error(
        `Failed to retrieve page info for pageId ${pageId}: Unknown error`
      );
    }
  }
}

export const getDatabase = cache(async (): Promise<Post[]> => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID as string,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page) => {
      const pageObject = page as PageObjectResponse;
      const properties = pageObject.properties as Record<
        string,
        NotionProperty
      >;

      // Generate a slug if it doesn't exist
      const slugProperty = properties.slug || properties.slug;
      let slug = "";
      if (slugProperty?.type === "rich_text" && slugProperty.rich_text?.[0]) {
        slug = slugProperty.rich_text[0].plain_text;
      }
      if (!slug) {
        slug = pageObject.id;
      }

      return {
        id: pageObject.id,
        slug: slug,
        title: getPropertyValue(properties.Name || properties.name),
        date: getDateValue(properties.Date || properties.date),
        last_edited_time: pageObject.last_edited_time,
        properties: properties,
        coverImage: getPropertyValue(
          properties.CoverImage || properties.coverImage
        ),
        author:
          properties.Author?.type === "people" ||
          properties.author?.type === "people"
            ? {
                name:
                  (properties.Author || properties.author).people[0]?.name ||
                  "",
                picture:
                  (properties.Author || properties.author).people[0]
                    ?.avatar_url || "",
              }
            : undefined,
        excerpt: getPropertyValue(properties.Excerpt || properties.excerpt),
        content: getPropertyValue(properties.Content || properties.content),
        preview:
          (properties.Preview?.type === "checkbox" &&
            properties.Preview.checkbox) ||
          (properties.preview?.type === "checkbox" &&
            properties.preview.checkbox) ||
          false,
      };
    });
  } catch (error) {
    throw error;
  }
});

export const getPageFromSlug = cache(async (slug: string) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID as string,
      filter: {
        or: [
          {
            property: "slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "id",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });
    if (response?.results?.length) {
      return response.results[0];
    }
    return null;
  } catch (error) {
    console.error("Error in getPageFromSlug:", error);
    throw error;
  }
});
// ヘルパー関数
function getDateValue(property: NotionProperty | undefined): string {
  if (!property) return "";

  switch (property.type) {
    case "date":
      return (property as DateProperty).date?.start || "";
    case "created_time":
      return property.created_time || "";
    case "last_edited_time":
      return property.last_edited_time || "";
    default:
      return "";
  }
}

export const getPage = cache(async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

export const getBlocks = cache(async (blockID: string): Promise<Block[]> => {
  if (!blockID) {
    throw new Error("blockID is undefined");
  }

  const blockId = blockID.replace(/-/g, "");

  const { results }: ListBlockChildrenResponse =
    await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
    });

  const childBlocks: Promise<Block>[] = results.map(async (block) => {
    if ("has_children" in block && block.has_children) {
      const children = await getBlocks(block.id);
      return { ...block, children };
    }
    return block;
  });

  return Promise.all(childBlocks).then((blocks) =>
    blocks.reduce((acc: Block[], curr: Block) => {
      if ((curr as any).type === "bulleted_list_item") {
        const lastBlock = acc[acc.length - 1] as any;
        if (lastBlock?.type === "bulleted_list") {
          lastBlock.bulleted_list.children.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "bulleted_list",
            bulleted_list: { children: [curr] },
          } as any);
        }
      } else if ((curr as any).type === "numbered_list_item") {
        const lastBlock = acc[acc.length - 1] as any;
        if (lastBlock?.type === "numbered_list") {
          lastBlock.numbered_list.children.push(curr);
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: "numbered_list",
            numbered_list: { children: [curr] },
          } as any);
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }, [])
  );
});

function getPropertyValue(property: NotionProperty | undefined): string {
  if (!property) return "";

  switch (property.type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "date":
      return (property as DateProperty).date?.start || "";
    case "formula":
      return property.formula?.string || "";
    default:
      return "";
  }
}
