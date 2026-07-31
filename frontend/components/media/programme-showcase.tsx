import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { mediaProgrammes } from "@/lib/media-programmes";

export function ProgrammeShowcase() {
  return (
    <div className="space-y-6">
      {mediaProgrammes.map((programme) => (
        <article
          key={programme.title}
          className="overflow-hidden rounded-3xl border border-brand-sand bg-white shadow-sm transition hover:shadow-md"
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 w-full shrink-0 md:h-auto md:w-52 lg:w-56">
              <Image
                src={programme.imageSrc}
                alt={programme.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 224px"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <h3 className="font-serif-display text-2xl text-brand-ink sm:text-3xl">{programme.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-ink/80 sm:text-base">{programme.description}</p>
              <Link
                href={programme.href}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-coral px-5 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-coral hover:text-white"
              >
                {programme.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
