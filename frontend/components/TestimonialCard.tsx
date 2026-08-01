import Image from "next/image";
import Link from "next/link";

export type TestimonialCardProps = {
  name: string;
  quote: string;
  bgImage: string;
  storyUrl: string;
  categories?: string[];
  readLabel?: string;
};

export function TestimonialCard({
  name,
  quote,
  bgImage,
  storyUrl,
  categories = [],
  readLabel = "Read Story",
}: TestimonialCardProps) {
  const isExternal = /^https?:\/\//.test(storyUrl);
  const label = readLabel.replace(/\s*→\s*$/, "").trim() || "Read Story";

  const ctaClassName =
    "group/cta mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-brand-red transition hover:text-brand-dark";

  const cta = (
    <>
      <span>{label}</span>
      <span aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-1">
        →
      </span>
    </>
  );

  return (
    <article className="group flex h-full min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-brand-light bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-brand-light">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 17rem, (max-width: 1024px) 20rem, 24rem"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <div className="flex items-end justify-between gap-2">
            <h3 className="min-w-0 text-xl font-semibold tracking-tight text-white sm:text-2xl">{name}</h3>
            {categories.length > 0 ? (
              <ul className="flex max-w-[55%] shrink-0 flex-wrap justify-end gap-1.5">
                {categories.map((category) => (
                  <li
                    key={category}
                    className="rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs sm:px-3"
                  >
                    {category}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between rounded-b-3xl bg-white p-5">
        <blockquote className="mb-4 text-sm italic leading-relaxed text-brand-dark/70 line-clamp-4">
          <p>&ldquo;{quote}&rdquo;</p>
        </blockquote>

        {isExternal ? (
          <a href={storyUrl} target="_blank" rel="noopener noreferrer" className={ctaClassName}>
            {cta}
          </a>
        ) : (
          <Link href={storyUrl} className={ctaClassName}>
            {cta}
          </Link>
        )}
      </div>
    </article>
  );
}
