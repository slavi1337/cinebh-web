import HeroSection from "../components/home/HeroSection";
import VenuesMarquee from "../components/home/VenuesMarquee";
import ContentSection from "../components/home/ContentSection";
import MovieCard from "../components/home/MovieCard";
import VenueCard from "../components/home/VenueCard";

import avatarPoster from "../assets/avatar-hero.jpg";
import creatorPoster from "../assets/creator-hero.jpg";
import rebelMoonPoster from "../assets/rebel-moon-hero.jpg";

const currentlyShowingMovies = [
  {
    title: "Avatar",
    image: avatarPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Kreator",
    image: creatorPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Rebel Moon: Part one",
    image: rebelMoonPoster,
    duration: "123 MIN",
    category: "Thriller",
  },
  {
    title: "Napoleon",
    image: avatarPoster,
    duration: "117 MIN",
    category: "SF",
  },
  {
    title: "Dune",
    image: avatarPoster,
    duration: "126 MIN",
    category: "Sci-Fi",
  },
  {
    title: "Interstellar",
    image: creatorPoster,
    duration: "169 MIN",
    category: "Drama",
  },
  {
    title: "Avatar",
    image: avatarPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Kreator",
    image: creatorPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Rebel Moon: Part one",
    image: rebelMoonPoster,
    duration: "123 MIN",
    category: "Thriller",
  },
  {
    title: "Napoleon",
    image: avatarPoster,
    duration: "117 MIN",
    category: "SF",
  },
  {
    title: "Dune",
    image: avatarPoster,
    duration: "126 MIN",
    category: "Sci-Fi",
  },
  {
    title: "Interstellar",
    image: creatorPoster,
    duration: "169 MIN",
    category: "Drama",
  },
];

const upcomingMovies = [
  {
    title: "Avatar",
    image: avatarPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Kreator",
    image: creatorPoster,
    duration: "117 MIN",
    category: "Fantasy",
  },
  {
    title: "Rebel Moon: Part one",
    image: rebelMoonPoster,
    duration: "123 MIN",
    category: "Thriller",
  },
  {
    title: "Napoleon",
    image: avatarPoster,
    duration: "117 MIN",
    category: "SF",
  },
  {
    title: "Gladiator II",
    image: avatarPoster,
    duration: "122 MIN",
    category: "Action",
  },
];

const venues = [
  {
    title: "Cineplex",
    image: avatarPoster,
    address: "Zmaja od Bosne 4, Sarajevo 71000",
  },
  {
    title: "Cinestar",
    image: creatorPoster,
    address: "Dzemala Bijedica St 160n, Sarajevo 71000",
  },
  {
    title: "Meeting Point",
    image: rebelMoonPoster,
    address: "Hamdije Kresevljakovica 13, Sarajevo 71000",
  },
  {
    title: "Cinema City",
    image: rebelMoonPoster,
    address: "Marsala Tita 26, Sarajevo 71000",
  },
  {
    title: "Apollo",
    image: creatorPoster,
    address: "Bulevar 12, Sarajevo 71000",
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <VenuesMarquee />

      <ContentSection
        title="Currently Showing"
        seeAllTo="/currently-showing"
        items={currentlyShowingMovies}
        renderCard={(movie) => <MovieCard {...movie} />}
      />

      <ContentSection
        title="Upcoming Movies"
        seeAllTo="/upcoming"
        items={upcomingMovies}
        renderCard={(movie) => <MovieCard {...movie} />}
      />

      <ContentSection
        title="Venues"
        seeAllTo="/venues"
        items={venues}
        renderCard={(venue) => <VenueCard {...venue} />}
      />
    </div>
  );
}
