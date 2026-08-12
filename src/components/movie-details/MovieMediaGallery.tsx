import { useEffect, useMemo, useState } from "react";
import moviePosterPlaceholder from "@/assets/movie-poster-placeholder.svg";
import LeftArrowIcon from "@/components/ui/icons/LeftArrowIcon";
import RightArrowIcon from "@/components/ui/icons/RightArrowIcon";

type MovieMediaGalleryProps = {
  title: string;
  trailerUrl: string | null;
  coverImageUrl: string | null;
  previewImageUrls: string[];
};

function getYouTubeEmbedUrl(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      if (parsedUrl.pathname.includes("/embed/")) {
        return `${url}${url.includes("?") ? "&" : "?"}autoplay=1`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function MovieMediaGallery({
  title,
  trailerUrl,
  coverImageUrl,
  previewImageUrls,
}: MovieMediaGalleryProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const embedUrl = getYouTubeEmbedUrl(trailerUrl);
  const images = useMemo(() => previewImageUrls.slice(0, 4), [previewImageUrls]);
  const galleryImages = Array.from({ length: 4 }, (_, index) => images[index]);
  const lightboxImages = useMemo(
    () => [coverImageUrl, ...images].filter(Boolean) as string[],
    [coverImageUrl, images],
  );
  const heroImage = coverImageUrl ?? images[0] ?? moviePosterPlaceholder;

  useEffect(() => {
    if (activeImageIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveImageIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((currentIndex) => {
          if (currentIndex === null) return currentIndex;
          return currentIndex === 0
            ? lightboxImages.length - 1
            : currentIndex - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((currentIndex) => {
          if (currentIndex === null) return currentIndex;
          return currentIndex === lightboxImages.length - 1
            ? 0
            : currentIndex + 1;
        });
      }
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, lightboxImages.length]);

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return currentIndex === 0 ? lightboxImages.length - 1 : currentIndex - 1;
    });
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return currentIndex === lightboxImages.length - 1 ? 0 : currentIndex + 1;
    });
  }

  return (
    <>
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.04fr_1fr]">
        <div className="h-64 sm:h-80 lg:h-[353px]">
          <div className="relative h-full w-full overflow-hidden rounded-2xl lg:rounded-r-none">
            {isVideoPlaying && embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${title} trailer`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (embedUrl) {
                    setIsVideoPlaying(true);
                    return;
                  }

                  setActiveImageIndex(0);
                }}
                className="block h-full w-full cursor-pointer"
              >
                <img
                  src={heroImage}
                  alt={`${title} trailer`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-black/40" />
                <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-brand-red text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-0.5 h-6 w-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="grid h-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:h-[353px]">
          {galleryImages.map((imageUrl, index) => (
            <button
              key={`${imageUrl ?? "empty"}-${index}`}
              type="button"
              disabled={!imageUrl}
              onClick={() => {
                if (!imageUrl) return;
                setActiveImageIndex(index + 1);
              }}
              className={`h-42 overflow-hidden bg-movie-details-chip-background text-left ${
                imageUrl ? "cursor-pointer" : "cursor-default"
              } ${index === 1 ? "sm:rounded-tr-2xl" : ""} ${
                index === 3 ? "sm:rounded-br-2xl" : ""
              }`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={`${title} preview ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-body-md text-page-muted">
                  No preview image
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {activeImageIndex !== null && lightboxImages[activeImageIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image preview`}
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={(event) => {
              event.stopPropagation();
              setActiveImageIndex(null);
            }}
            className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-xl font-bold text-page-heading"
          >
            X
          </button>

          {lightboxImages.length > 1 && (
            <button
              type="button"
              aria-label="Show previous image"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              className="absolute left-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-page-heading"
            >
              <LeftArrowIcon />
            </button>
          )}

          <img
            src={lightboxImages[activeImageIndex]}
            alt={`${title} enlarged preview`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[82vh] max-w-[88vw] rounded-2xl object-contain"
          />

          {lightboxImages.length > 1 && (
            <button
              type="button"
              aria-label="Show next image"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              className="absolute right-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-page-heading"
            >
              <RightArrowIcon />
            </button>
          )}
        </div>
      )}
    </>
  );
}
