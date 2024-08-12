import Link from "next/link";
import { Intro } from "../_components/intro";
import Container from "@/app/_components/container";
import Footer from "../_components/footer";
import Image from "next/image";
import { getDatabase } from "@/lib/notion";
import styles from "./index.module.css";
import { Text } from "../_components/posts-text";

async function getPosts() {
  const database = await getDatabase();

  return database;
}

export default async function Blog() {
  const databaseId = process.env.DATABASE_ID;
  const posts = await getPosts();

  return (
    <Container>
      <Intro />
      <main className="container">
        <section className="flex justify-center flex-col md:flex-row !items-center md:items-start md:gap-10 gap-5 md:m-20">
          <Image
            src="/assets/blog/dynamic-routing/vietnam.jpg"
            alt=""
            className="rounded-full "
            width={250}
            height={250}
          ></Image>
          <div className="flex flex-col md:gap-5 justify-center text-center md:text-left">
            <h1 className="md:text-3xl text-xl font-serif mb-3 ">
              野に咲く花のブログ
            </h1>
            <p className="text-sm md:text-base font-serif">
              日々のつれづれです
            </p>
          </div>
        </section>

        <section className="container mx-auto md:w-[700px] md:mt-20 mt-5">
          <h2 className="font-bold text-gray-600 mb-5 pb-5 uppercase border-b border-gray-300 text-sm tracking-wide">
            all posts
          </h2>
          <ol>
            {posts.map((post) => {
              const date = new Date(post.last_edited_time).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }
              );
              const slug = post.properties?.Slug?.rich_text[0].text.content;
              return (
                <li key={post.id} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    <Link href={`/blog/${slug}`}>
                      <Text text={post.properties.Name.title} />
                    </Link>
                  </h3>
                  <p className={styles.postDescription}>{date}</p>
                  <Link href={`/blog/${slug}`}>Read post →</Link>
                </li>
              );
            })}
          </ol>
        </section>
      </main>
      <Footer />
    </Container>
  );
}
