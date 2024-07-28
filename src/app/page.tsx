import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import Footer from "./_components/footer";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  // const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
        />
        <Footer />
      </Container>
    </main>
  );
}
