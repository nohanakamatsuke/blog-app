import CoverImage from "@/app/_components/cover-image";
type Props = {
  title: string;
  coverImage: string;
};

export function HeroPost({
  title,
  coverImage,
}: Props) {
  return (
    <section>
      <div className="md:mb-16">
        <CoverImage title={title} src={coverImage} />
      </div>
    </section>
  );
}
