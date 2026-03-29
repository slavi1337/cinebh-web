import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatarPoster from "../../assets/avatar-hero.jpg";
import creatorPoster from "../../assets/creator-hero.jpg";
import rebelMoonPoster from "../../assets/rebel-moon-hero.jpg";

const featuredMovies = [
  {
    id: 1,
    title: "Avatar: The way of water",
    categories: ["Adventure"],
    description:
      "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    image: avatarPoster,
  },
  {
    id: 2,
    title: "The Creator",
    categories: ["Action", "Sci-Fi", "Thriller"],
    description:
      "Against the backdrop of a future war, a former special forces agent is recruited to hunt down a mysterious weapon.",
    image: creatorPoster,
  },
  {
    id: 3,
    title: "Rebel Moon: Part One",
    categories: ["Adventure", "Action", "Fantasy"],
    description:
      "When a peaceful settlement on the edge of the galaxy is threatened, a young woman seeks warriors to stand against tyranny.",
    image: rebelMoonPoster,
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMovie = featuredMovies[activeIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === featuredMovies.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  return (
    <section className="relative h-182.5 w-full overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {featuredMovies.map((movie) => (
          <div key={movie.id} className="h-full w-full shrink-0">
            <img
              src={movie.image}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative mx-auto h-full w-full max-w-360 px-4 md:px-8 lg:px-23">
        <div className="relative top-94 h-61.75 max-w-155">
          <div className="flex flex-wrap gap-2">
            {activeMovie.categories.map((category) => (
              <span
                key={category}
                className="inline-flex h-8 shrink-0 items-center rounded-lg bg-hero-badge-background px-2 text-[14px] leading-5 tracking-[0.0025em] text-hero-badge-text"
              >
                {category}
              </span>
            ))}
          </div>
          <h2 className="mt-6 max-w-170 text-[32px] leading-10 font-bold tracking-[-0.005em] text-white md:text-[40px] md:leading-12 lg:text-[48px] lg:leading-14">
            {activeMovie.title}
          </h2>

          <p className="mt-4 max-w-112.5 text-[18px] leading-6 font-bold tracking-[-0.0015em] text-white md:text-[20px] lg:line-clamp-2">
            {activeMovie.description}
          </p>
          <Link
            to="/currently-showing"
            className="mt-6 inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-red px-5 text-[16px] leading-6 font-semibold tracking-[0.005em] text-hero-button-text transition-colors hover:bg-red-800 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0"
          >
            Buy Ticket
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            type="button"
            aria-label={`Show ${movie.title}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1 w-7.5 rounded-full cursor-pointer transition-colors ${
              activeIndex === index
                ? "bg-hero-slider-active"
                : "bg-hero-slider-inactive"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
