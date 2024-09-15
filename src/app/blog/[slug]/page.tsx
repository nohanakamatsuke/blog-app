import { FC } from "react";
import { notFound } from "next/navigation";
import { getDatabase, getPageContent } from "@/lib/notion";
import Container from "@/app/_components/container";
import Footer from "@/app/_components/footer";
import { Intro } from "@/app/_components/intro";
import ReactMarkdown from "react-markdown";
import { Post } from "@/interfaces/post";

interface BlogPostProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const database = await getDatabase();
  return database.map((post) => ({
    slug: post.properties?.slug?.rich_text?.[0]?.plain_text || post.id,
  }));
}

const BlogPost: FC<BlogPostProps> = async ({ params }) => {
  const { slug } = params;
  const database = await getDatabase();
  const post = database.find(
    (post) =>
      post.properties?.slug?.rich_text?.[0]?.plain_text === slug ||
      post.id === slug
  ) as Post | undefined;

  if (!post) {
    notFound();
  }

  const content = await getPageContent(post.id);
  const markdown = content.map((block) => block.parent).join("\n");

  // タイトルの取得方法修正
  const title = post.properties?.Name?.title?.[0]?.plain_text || "Untitled";

  return (
    <Container>
      <Intro />
      <article className="container mx-auto md:w-[700px] mt-10">
        <h1 className="text-3xl font-bold mb-5">{title}</h1>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </article>
      <Footer />
    </Container>
  );
};

export default BlogPost;
