import { config } from "dotenv";
config();
import { databaseId } from "@/app/blog/page";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { cache } from "react";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

type Block = BlockObjectResponse | PartialBlockObjectResponse;

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPageContent(pageId: string) {
  const mdblocks = await n2m.pageToMarkdown(pageId, 2);
  console.log("Markdown Content:", mdblocks);
  return mdblocks;
}

export const getDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
  });
  return response.results;
});

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
    }, []),
  );
});

export const getPageFromSlug = cache(async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
    filter: {
      property: "Name",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });
  if (response?.results?.length) {
    return response.results[0];
  }
  return null;
});
