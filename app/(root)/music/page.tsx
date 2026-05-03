import { Metadata } from "next";
import Link from "next/link";

import { AnimatedSection } from "@/components/common/animated-section";
import { AnimatedText } from "@/components/common/animated-text";
import { AudioPlayer } from "@/components/music/audio-player";
import { YouTubeGrid, YouTubeGridFallback } from "@/components/music/youtube-grid";
import PageContainer from "@/components/common/page-container";
import { SectionNav } from "@/components/common/section-nav";
import { bandcampCollab, spotifyCollabs } from "@/config/music";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Music | TheShyGuitarist",
  description:
    "Original compositions, session guitar work, Spotify collaborations, and YouTube covers by Anshul Jain (@TheShyGuitarist).",
  alternates: {
    canonical: `${siteConfig.url}/music`,
  },
};

const CHANNEL_ID = "UCYPRfAOZ0z-r-jDT3MMCLsQ";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

async function getLatestYouTubeVideos(
  channelId: string,
  count = 9
): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const text = await res.text();

    const entries = text.split("<entry>").slice(1);
    return entries
      .map((entry) => {
        const idMatch = entry.match(/<yt:videoId>([\w-]+)<\/yt:videoId>/);
        const titleMatch = entry.match(/<title>(.*?)<\/title>/);
        const id = idMatch?.[1] ?? "";
        const title = titleMatch?.[1] ?? "Untitled";
        return {
          id,
          title,
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      })
      .filter((v) => v.id)
      .slice(0, count);
  } catch {
    return [];
  }
}

export default async function MusicPage() {
  const videos = await getLatestYouTubeVideos(CHANNEL_ID, 20);

  return (
    <PageContainer
      title="Music"
      description="I'm a guitarist with 10+ years of experience. Here's some of my work — originals, covers, session collaborations, and film scores."
    >
      <SectionNav
        sections={[
          { id: "featured", label: "Featured" },
          { id: "originals", label: "Originals" },
          { id: "youtube", label: "YouTube" },
        ]}
      />
      {/* ── Featured Collaborations (Spotify + Bandcamp) ── */}
      <AnimatedSection direction="up" className="space-y-4" id="featured">
        <AnimatedText as="h2" className="font-heading text-2xl sm:text-3xl">
          Featured Collaborations
        </AnimatedText>
        <p className="text-sm text-muted-foreground max-w-xl">
          Session guitar work on released tracks — available on Spotify and
          Bandcamp.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Spotify tracks */}
          {spotifyCollabs.map((track) => (
            <div key={track.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">{track.title}</p>
              <p className="text-xs text-muted-foreground">
                {track.artist}
                <span className="mx-1.5 opacity-40">·</span>
                <span>Solo: {track.soloTime}</span>
              </p>
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                style={{ border: 0 }}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          ))}
          {/* Bandcamp track — full width */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <p className="text-sm font-medium text-foreground">
              {bandcampCollab.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {bandcampCollab.artist}
              <span className="mx-1.5 opacity-40">·</span>
              <span>Solo: {bandcampCollab.soloTime}</span>
            </p>
            <iframe
              src={bandcampCollab.embedSrc}
              width="100%"
              height="120"
              style={{ border: 0 }}
              allow="autoplay"
              loading="lazy"
              className="rounded-xl"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* ── Audio Tracks ── */}
      <AnimatedSection direction="up" delay={0.1} className="space-y-4 mt-14" id="originals">
        <AnimatedText as="h2" className="font-heading text-2xl sm:text-3xl">
          Original Tracks & Covers
        </AnimatedText>
        <p className="text-sm text-muted-foreground max-w-xl">
          Click any track to play. All recorded and produced by me.
        </p>
        <AudioPlayer />
      </AnimatedSection>

      {/* ── YouTube Videos ── */}
      <AnimatedSection direction="up" delay={0.15} className="space-y-4 mt-14" id="youtube">
        <div className="flex items-center justify-between">
          <AnimatedText as="h2" className="font-heading text-2xl sm:text-3xl">
            YouTube
          </AnimatedText>
          <Link
            href={`https://www.youtube.com/@TheShyGuitarist9`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            @TheShyGuitarist9 →
          </Link>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Latest videos from my YouTube channel — updated automatically.
        </p>

        {videos.length > 0 ? (
          <div className="space-y-8">
            <YouTubeGrid 
              videos={videos} 
              channelHandle="TheShyGuitarist9" 
            />
          </div>
        ) : (
          <YouTubeGridFallback channelHandle="TheShyGuitarist9" />
        )}
      </AnimatedSection>
    </PageContainer>
  );
}
