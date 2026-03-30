type MovieCardProps = {
  title: string;
  image: string;
  duration: string;
  category: string;
};

export default function MovieCard({
  title,
  image,
  duration,
  category,
}: MovieCardProps) {
  return (
    <article className="flex h-98.75 w-full max-w-75.5 flex-col rounded-3xl border border-card-border bg-card-background p-4 shadow-[0px_2px_4px_-2px_rgba(52,64,84,0.08),0px_4px_6px_-1px_rgba(52,64,84,0.08)]">
      <img
        src={image}
        alt={title}
        className="h-71.75 w-full rounded-2xl object-cover"
      />

      <div className="pt-4">
        <h3 className="text-[20px] leading-6 font-bold tracking-[0.0085em] text-card-title-text">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-[14px] leading-5 font-normal tracking-[0.0125em] text-card-meta-text">
          <span>{duration}</span>
          <span className="h-4 w-px bg-card-border" aria-hidden="true" />
          <span>{category}</span>
        </div>
      </div>
    </article>
  );
}
