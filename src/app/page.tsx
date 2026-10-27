"use client";

import ContinueWatching from "@/components/continue-watching";
import FeaturedCollection from "@/components/featured-collection";
import { useGetSpotlightAnime } from "@/query/get-spotlight-anime";
import { useGetRecentAnime } from "@/query/get-recent-anime";
import { useGetPopularAnime } from "@/query/get-popular-anime";
import { useGetTrendingAnime } from "@/query/get-trending-anime";
import { useGetUpcomingAnime } from "@/query/get-upcoming-anime";
import dynamic from "next/dynamic";

// Dynamically import components
const HeroSection = dynamic(() => import("@/components/hero-section"));
const LatestEpisodesAnime = dynamic(
  () => import("@/components/latest-episodes-section"),
);
const AnimeSchedule = dynamic(() => import("@/components/anime-schedule"));
const AnimeSections = dynamic(() => import("@/components/anime-sections"));

import React, { useState, useMemo } from "react";

import RecentCommentsSection from "@/components/recent-comments-section";

export default function Home() {
  const [trendingPage, setTrendingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  const { data: spotlightList = [], isLoading: isLoadingSpotlight } =
    useGetSpotlightAnime();
  const { data: recentRes, isLoading: isLoadingRecent } = useGetRecentAnime();
  const { data: popularRes, isLoading: isLoadingPopular } =
    useGetPopularAnime();
  const { data: trendingRes, isLoading: isLoadingTrending } =
    useGetTrendingAnime(trendingPage, 14);
  const { data: upcomingRes, isLoading: isLoadingUpcoming } =
    useGetUpcomingAnime(upcomingPage, 14);

  const recentList = recentRes?.results || [];
  const popularList = popularRes?.results || [];
  const trendingList = trendingRes?.results || [];
  const upcomingList = upcomingRes?.results || [];

  // Store first 3 records into dedicated variables so pagination page changes in other sections don't re-trigger FeaturedCollection
  const featuredFavoriteList = useMemo(
    () => popularList.slice(0, 3),
    [popularList.length > 0 ? popularList[0]?.id : null],
  );
  const featuredPopularList = useMemo(
    () => popularList.slice(3, 6),
    [popularList.length > 0 ? popularList[0]?.id : null],
  );
  const featuredRecentList = useMemo(
    () => recentList.slice(0, 3),
    [recentList.length > 0 ? recentList[0]?.id : null],
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#10101b] text-white">
      <HeroSection
        spotlightAnime={spotlightList}
        isDataLoading={isLoadingSpotlight}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><div className="mb-7 border-b border-violet-400/15 pb-5"><p className="mb-1 text-xs font-bold uppercase tracking-widest text-violet-400">Discover your next favourite</p><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Explore Anime on Streamly</h2><p className="mt-2 text-sm text-slate-400">Latest episodes, trending series and anime worth watching.</p></div></div>
      <LatestEpisodesAnime loading={isLoadingRecent} />

      <ContinueWatching loading={false} />

      <FeaturedCollection
        loading={isLoadingPopular || isLoadingRecent}
        featuredAnime={[
          {
            title: "Most Favorite Anime",
            anime: featuredFavoriteList,
          },
          {
            title: "Most Popular Anime",
            anime: featuredPopularList,
          },
          {
            title: "Recent Completed Anime",
            anime: featuredRecentList,
          },
        ]}
      />

      <AnimeSections
        title="Trending Now"
        animeList={trendingList}
        loading={isLoadingTrending}
        page={trendingPage}
        hasNextPage={trendingRes?.hasNextPage}
        onPageChange={(p) => setTrendingPage(p)}
      />

      <RecentCommentsSection />

      <AnimeSchedule />

      <AnimeSections
        title="Coming Soon"
        animeList={upcomingList}
        loading={isLoadingUpcoming}
        page={upcomingPage}
        hasNextPage={upcomingRes?.hasNextPage}
        onPageChange={(p) => setUpcomingPage(p)}
      />
    </div>
  );
}
