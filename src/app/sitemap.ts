// NEXT.JS 14 – SITEMAP MULTI-FICHIERS AVEC PRIORITÉS PAGES PRINCIPALES
// Pages principales avec priorité et changeFrequency, puis le reste du site

import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const SITE_URL = process.env.SITE_URL ?? "https://example.com";
const CHUNK_SIZE = 50000;

export async function generateSitemaps() {
  const [videosCount, actorsCount, channelsCount, categoriesCount] = await Promise.all([
    prisma.video.count(),
    prisma.actor.count(),
    prisma.channel.count(),
    prisma.category.count(),
  ]);

  const total = videosCount + actorsCount + channelsCount + categoriesCount;
  const pages = Math.ceil(total / CHUNK_SIZE);

  return Array.from({ length: pages }).map((_, i) => ({ id: String(i + 1) }));
}

export default async function sitemapIndex(): Promise<MetadataRoute.SitemapIndex> {
  const sitemaps = await generateSitemaps();
  return sitemaps.map((s) => ({
    url: `${SITE_URL}/sitemap/${s.id}.xml`,
  }));
}

export async function generateSitemapChunk(id: number) {
  const skip = (id - 1) * CHUNK_SIZE;

  // Pages principales à haute priorité
  const mainPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${SITE_URL}channel`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}actor`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}categorie`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}search`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  // Récupération dynamique de toutes les URLs
  const [videos, actors, channels, categories] = await Promise.all([
    prisma.video.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.actor.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.channel.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicUrls: MetadataRoute.Sitemap = [
    ...videos.map(v => ({ url: `${SITE_URL}/videos/${v.slug}`, lastModified: v.updatedAt?.toISOString() })),
    ...actors.map(a => ({ url: `${SITE_URL}/actors/${a.slug}`, lastModified: a.updatedAt?.toISOString() })),
    ...channels.map(c => ({ url: `${SITE_URL}/channels/${c.slug}`, lastModified: c.updatedAt?.toISOString() })),
    ...categories.map(cat => ({ url: `${SITE_URL}/categories/${cat.slug}`, lastModified: cat.updatedAt?.toISOString() })),
  ];

  // Découpage pour le sitemap chunk
  const slice = dynamicUrls.slice(skip, skip + CHUNK_SIZE);

  // On place les pages principales uniquement dans le premier chunk
  return id === 1 ? [...mainPages, ...slice] : slice;
}

export async function sitemap({ params }: { params: { id: string } }): Promise<MetadataRoute.Sitemap> {
  const id = Number(params.id);
  return generateSitemapChunk(id);
}
