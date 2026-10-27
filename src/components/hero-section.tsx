"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Play, Info, Star } from "lucide-react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import { ROUTES } from "@/constants/routes";
import { MediaList } from "@/types/miruro-api";
import Link from "next/link";

type Props = { spotlightAnime: MediaList[]; isDataLoading: boolean };

export default function HeroSection({ spotlightAnime, isDataLoading }: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);

  if (isDataLoading || !spotlightAnime?.length) {
    return <div className="mx-4 mt-24 h-[380px] animate-pulse rounded-xl bg-zinc-900 sm:mx-6" aria-label="Loading featured anime" />;
  }
  return (
    <section aria-label="Featured anime" className="px-4 pt-[152px] sm:px-6">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b0808]">
        <Carousel setApi={setApi} opts={{ loop: true }}>
          <CarouselContent className="ml-0">
            {spotlightAnime.map((anime, index) => {
              const title = anime.title?.english || anime.title?.romaji || anime.title?.native || "Untitled";
              const art = anime.bannerImage || anime.coverImage?.extraLarge || anime.coverImage?.large;
              return <CarouselItem key={anime.id || index} className="pl-0">
                <div className="relative flex min-h-[380px] flex-col overflow-hidden md:h-[380px] md:flex-row">
                  <div className="relative z-10 flex w-full flex-col justify-center gap-5 bg-[#0d0808] px-6 py-12 md:w-[45%] md:px-10">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      {anime.format && <span className="rounded-full border border-white/15 px-3 py-1">{anime.format}</span>}
                      {anime.seasonYear && <span className="rounded-full border border-white/15 px-3 py-1">{anime.seasonYear}</span>}
                      {!!anime.averageScore && <span className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1"><Star size={12} className="fill-orange-500 text-orange-500" />{(anime.averageScore / 10).toFixed(1)}</span>}
                    </div>
                    <h1 className="line-clamp-2 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">{title}</h1>
                    <p className="line-clamp-3 max-w-xl text-sm leading-7 text-slate-400">{anime.genres?.join(" · ") || "Discover this series on Streamly."}</p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`${ROUTES.ANIME_DETAILS}/${anime.id}`} className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-black hover:bg-orange-400"><Play size={15} fill="currentColor" /> Watch now</Link>
                      <Link href={`${ROUTES.ANIME_DETAILS}/${anime.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black px-5 py-3 text-sm font-bold text-white hover:bg-zinc-900"><Info size={15} /> View details</Link>
                    </div>
                  </div>
                  <div className="relative min-h-[220px] flex-1 bg-zinc-900 md:min-h-0">
                    {art && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${art}")` }} />}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d0808]/30 via-transparent to-transparent" />
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white">Discover on Streamly</span>
                  </div>
                </div>
              </CarouselItem>;
            })}
          </CarouselContent>
        </Carousel>
        <div className="absolute right-4 top-4 z-20 flex gap-2">
          <button type="button" aria-label="Previous featured anime" onClick={() => api?.scrollPrev()} className="rounded-sm border border-white/15 bg-black/80 p-2 text-white hover:bg-black"><ArrowLeft size={18}/></button>
          <button type="button" aria-label="Next featured anime" onClick={() => api?.scrollNext()} className="rounded bg-black/70 p-2 text-white hover:bg-black"><ArrowRight size={18}/></button>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-3" aria-label="Featured anime slides">
        {spotlightAnime.map((anime, index) => <button key={anime.id || index} type="button" aria-label={`Show featured anime ${index + 1}`} aria-current={selected === index ? "true" : undefined} onClick={() => api?.scrollTo(index)} className={`h-1 rounded-full transition-all ${selected === index ? "w-6 bg-orange-500" : "w-2 bg-zinc-600 hover:bg-zinc-400"}`} />)}
      </div>
    </section>
  );
}
