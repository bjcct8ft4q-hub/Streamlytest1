"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import AnimeCard from "@/components/anime-card";
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
  const latest = recent.filter((a) => filter === "all" || (filter === "movies" ? a.format === "MOVIE" : a.format !== "MOVIE"));
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
          <strong className="text-white">More anime coming soon.</strong> New series and seasons are being added.
        </div>
        <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_345px]">
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
            latest.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {latest.slice(0, 18).map((anime) => <AnimeCard key={anime.id} title={anime.title?.english || anime.title?.romaji || anime.title?.native || "Untitled"} poster={anime.coverImage?.extraLarge || anime.coverImage?.large || ""} score={anime.averageScore} format={anime.format} episodes={anime.episodes || 1} episodeCard href={`${ROUTES.WATCH}?anime=${anime.id}&ep=${anime.episodes || 1}`} className="!h-auto !max-w-none !min-w-0 aspect-[2/3] !rounded-sm" />)}
            </div> : <p className="py-8 text-sm text-zinc-400">No episodes available right now.</p>}
          </section>
          <aside className="space-y-5">
            <section className="rounded-md border border-[#332524] bg-[#0e0b0b] p-4">
              <div className="flex items-center justify-between border-b border-[#332524] pb-3">
                <h2 className="text-lg font-black">Top Rated</h2>
                <div className="flex gap-3 text-xs">{(["day","week","month"] as const).map((p) => <button type="button" key={p} onClick={() => setPeriod(p)} className={period === p ? "border-b-2 border-orange-500 pb-2 text-orange-500" : "pb-2 text-zinc-400"}>{p}</button>)}</div>
              </div>
              <p className="py-5 text-xs text-zinc-400">No top rated series or movies available yet.</p>
            </section>
            <section className="rounded-md border border-[#332524] bg-[#0e0b0b] p-4">
              <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black">Upcoming Anime</h2><span className="text-xs text-zinc-500">Next 7 days</span></div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => <button key={index} type="button" onClick={() => setDayOffset(index)} className="flex min-w-0 flex-col items-center gap-1">
                  <span className={`text-[10px] font-semibold uppercase ${index === dayOffset ? "text-orange-500" : "text-zinc-500"}`}>{date.toLocaleDateString("en-GB",{weekday:"short"})}</span>
                  <span className={`flex h-9 w-full items-center justify-center rounded text-xs font-bold ${index === dayOffset ? "bg-orange-500 text-black" : "bg-[#1a191e] text-white"}`}>{date.getDate()}</span>
                </button>)}
              </div>
              <p className="mt-4 text-xs text-zinc-400">No confirmed releases listed for this date yet.</p>
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
