"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useGetSpotlightAnime } from "@/query/get-spotlight-anime";
import { useGetRecentAnime } from "@/query/get-recent-anime";
import { useGetTrendingAnime } from "@/query/get-trending-anime";
import { useGetUpcomingAnime } from "@/query/get-upcoming-anime";

const HeroSection = dynamic(() => import("@/components/hero-section"));
const ContinueWatching = dynamic(() => import("@/components/continue-watching"));
const AnimeSections = dynamic(() => import("@/components/anime-sections"));

export default function Home() {
  const [filter, setFilter] = useState<"all" | "series" | "movies">("all");
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [dayOffset, setDayOffset] = useState(0);
  const [trendingPage, setTrendingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const { data: spotlightList = [], isLoading: loadingSpotlight } = useGetSpotlightAnime();
  const { data: recentRes, isLoading: loadingRecent } = useGetRecentAnime(1, 18);
  const { data: trendingRes, isLoading: loadingTrending } = useGetTrendingAnime(trendingPage, 14);
  const { data: upcomingRes, isLoading: loadingUpcoming } = useGetUpcomingAnime(upcomingPage, 14);
  const recent = recentRes?.results || [];
  const latest = recent.filter((a) => (a.seasonYear === 2026 || !recent.some((x) => x.seasonYear === 2026)) && (filter === "all" || (filter === "movies" ? a.format === "MOVIE" : a.format !== "MOVIE")));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
  return (
    <main className="min-h-screen bg-black pb-16 text-white">
      <HeroSection spotlightAnime={spotlightList} isDataLoading={loadingSpotlight} />
      <div className="mx-auto mt-12 w-full max-w-[1900px] px-4 sm:px-6">
        <div className="rounded border border-orange-500/30 bg-[#100b09] px-4 py-3 text-xs text-zinc-400">
          <span className="mr-2 text-orange-500">●</span>
          <strong className="text-white">More anime coming soon.</strong> New series and seasons are being added. Check back within 24–48 hours for updates.
        </div>
        <div className="mt-3 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="border-l-[3px] border-orange-500 pl-3 text-xl font-black tracking-tight">Latest Episodes · 2026 releases</h2>
              <div className="flex gap-4 text-xs font-semibold">
                {(["all", "series", "movies"] as const).map((item) =>
                  <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "text-orange-500" : "text-zinc-400 hover:text-white"}>{item === "all" ? "All" : item === "series" ? "Series" : "Movies"}</button>
                )}
              </div>
            </div>
            {loadingRecent ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{Array.from({length: 6}, (_, i) => <div key={i} className="aspect-[2/3] animate-pulse bg-zinc-900" />)}</div> :
            latest.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {latest.slice(0, 18).map((anime) => (
                <Link key={anime.id} href={`${ROUTES.ANIME_DETAILS}/${anime.id}`} className="group block min-w-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-[#161616]">
                    <Image unoptimized fill sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 15vw" className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" src={anime.coverImage?.extraLarge || anime.coverImage?.large || "/icon.png"} alt={anime.title?.english || anime.title?.romaji || "Anime poster"} />
                    {anime.averageScore != null && <span className="absolute left-2 top-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white"><span className="text-yellow-400">★</span> {(anime.averageScore / 10).toFixed(1)}</span>}
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">EP {anime.episodes ?? 0}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-sm font-semibold leading-relaxed text-white group-hover:text-orange-500"><span className="mr-1.5 text-orange-500">•</span>{anime.title?.english || anime.title?.romaji || anime.title?.native || "Untitled"}</h3>
                    <p className="mt-1 pl-3 text-xs text-zinc-500">{anime.format === "MOVIE" ? "Movie" : anime.format || "TV"}</p>
                  </div>
                </Link>
              ))}
            </div> : <p className="py-8 text-sm text-zinc-400">No episodes available right now.</p>}
          </section>
          <aside className="space-y-6">
            <section className="rounded-lg border border-[#332524] bg-[#0e0b0b] p-4">
              <div className="flex items-center justify-between border-b border-[#332524] pb-3">
                <h2 className="text-xl font-extrabold">Top Rated</h2>
                <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider">{(["day","week","month"] as const).map((p) => <button type="button" key={p} onClick={() => setPeriod(p)} className={period === p ? "border-b-2 border-orange-500 pb-2 text-orange-500" : "pb-2 text-zinc-400"}>{p}</button>)}</div>
              </div>
              <p className="py-5 text-sm leading-relaxed text-zinc-400">No top rated series or movies available yet.</p>
            </section>
            <section className="rounded-md border border-[#332524] bg-[#0e0b0b] p-4">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Upcoming Anime</h2><span className="text-xs text-zinc-500">Next 7 days</span></div>
              <div className="grid grid-cols-7 gap-1.5 border-b border-[#332524] pb-4">
                {days.map((date, index) => <button key={index} type="button" onClick={() => setDayOffset(index)} className="flex min-w-0 flex-col items-center gap-1">
                  <span className={`text-[10px] font-semibold uppercase ${index === dayOffset ? "text-orange-500" : "text-zinc-500"}`}>{date.toLocaleDateString("en-GB",{weekday:"short"})}</span>
                  <span className={`flex h-9 w-full items-center justify-center rounded text-xs font-bold ${index === dayOffset ? "bg-orange-500 text-black" : "bg-[#1a191e] text-white"}`}>{date.getDate()}</span>
                </button>)}
              </div>
              <p className="mt-4 text-sm text-zinc-400">No confirmed releases listed for this date yet.</p>
            </section>
          </aside>
        </div>
        <div className="mt-12"><ContinueWatching loading={false}/></div>
        <AnimeSections title="Trending Anime" animeList={trendingRes?.results || []} loading={loadingTrending} page={trendingPage} hasNextPage={trendingRes?.hasNextPage} onPageChange={setTrendingPage}/>
        <AnimeSections title="Upcoming Anime" animeList={upcomingRes?.results || []} loading={loadingUpcoming} page={upcomingPage} hasNextPage={upcomingRes?.hasNextPage} onPageChange={setUpcomingPage}/>
      </div>
    </main>
  );
}
