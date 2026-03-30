const venues = [
  "Cineplexx",
  "Cinestar",
  "Cinema City",
  "Meeting Point",
  "Kinoteka",
  "Kino Novi Grad",
  "Cineplexx",
  "Apollo",
  "Multiplex",
  "Kriterion",
];

const duplicatedVenues = [...venues, ...venues];

export default function VenuesMarquee() {
  return (
    <section className="w-full overflow-hidden bg-venues-section-background">
      <div className="mx-auto flex h-41 w-full items-center overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-10 py-2">
          {duplicatedVenues.map((venue, index) => (
            <div
              key={`${venue}-${index}`}
              className="flex h-16 min-w-31.75 shrink-0 items-center justify-center rounded-lg border border-venue-card-border bg-venue-card-background px-4"
            >
              <span className="text-center text-[24px] leading-8 font-bold tracking-[-0.0015em] text-venue-card-text">
                {venue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
