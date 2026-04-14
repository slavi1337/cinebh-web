import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { HeroMovie } from "@/types/homepage";

type HeroSectionProps = {
  movies: HeroMovie[];
};

export default function HeroSection({ movies }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (movies.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === movies.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5000);

    return () => clearTimeout(timeout);
  }, [activeIndex, movies]);

  useEffect(() => {
    setActiveIndex(0);
  }, [movies]);

  if (movies.length === 0) {
    return null;
  }

  const activeMovie = movies[activeIndex];

  return (
    <section className="relative h-182.5 w-full overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="h-full w-full shrink-0">
            <img
              src={movie.imageUrl}
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
            {activeMovie.genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex h-8 shrink-0 items-center rounded-lg bg-hero-badge-background px-2 text-[14px] leading-5 tracking-[0.0025em] text-hero-badge-text"
              >
                {genre}
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
            className="mt-6 inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-red px-5 text-body-md font-semibold text-hero-button-text transition-colors hover:bg-red-800 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0"
          >
            Buy Ticket
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-6">
        {movies.map((movie, index) => (
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
