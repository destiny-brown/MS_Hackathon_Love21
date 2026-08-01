"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { boardMemberImage, type BoardMember } from "@/lib/site-data";

const FALLBACK_SRC = "/images/board/templateicon.png";

export function BoardMemberCard({ member }: { member: BoardMember }) {
  const [src, setSrc] = useState(boardMemberImage(member));

  return (
    <Link
      href={`/board-of-directors/${member.slug}`}
      className="group overflow-hidden rounded-2xl border border-brand-light bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-light">
        <Image
          src={src}
          alt={member.name}
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          onError={() => {
            if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC);
          }}
        />
      </div>
      <div className="p-3 sm:p-4">
        <h2 className="text-sm font-semibold leading-snug text-brand-dark sm:text-base">{member.name}</h2>
        <p className="mt-0.5 text-xs text-brand-dark/60">{member.role ?? "Board Member"}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-red transition group-hover:gap-1.5 sm:mt-3">
          View profile
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
