

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center mt-8 mb-8 md:mb-12">
      <h1 className="text-5xl md:text-4xl font-serif tracking-tighter leading-tight md:pr-8 relative">
        <span className="text-xl md:text-5xl">Nohana Kamatsuke</span>
        <span className="absolute top-0 right-0 h-full w-0.5 hidden bg-black opacity-50 dark:bg-white md:block"></span>
      </h1>
      <nav>
        <ul className="flex space-x-2">
          <li><a href="#" className="text-xs text-5xl font-small md:pl-7 md:text-xl">About</a></li>
          <li><a href="#" className="text-xs text-5xl font-small md:px-4 md:text-xl">Blog</a></li>
        </ul>
      </nav>
    </section>
  );
}
