// NEXT.JS 14 – SITEMAP MULTI-FICHIERS AVEC PRIORITÉS PAGES PRINCIPALES
// Pages principales avec priorité et changeFrequency, puis le reste du site

import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const SITE_URL = process.env.Site_URL ?? "https://example.com";
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

export default async function sitemap(): Promise<MetadataRoute.SitemapIndex> {
  const sitemaps = await generateSitemaps();
  return sitemaps.map((s) => ({
    url: `${SITE_URL}/sitemap/${s.id}.xml`,
  }));
}

export async function generateSitemapChunk(id: number) {
  const skip = (id - 1) * CHUNK_SIZE;

  // Pages principales à haute priorité
  const mainPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${SITE_URL}/channel`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/actor`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/categorie`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  // Récupération de toutes les URLs dynamiques
  // Note: Pour de très grandes bases de données, on pourrait optimiser avec skip/take
  // mais cela nécessiterait une logique complexe de répartition entre types
  const [videos, actors, channels, categories] = await Promise.all([
    prisma.video.findMany({ 
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' }
    }),
    prisma.actor.findMany({ 
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' }
    }),
    prisma.channel.findMany({ 
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' }
    }),
    prisma.category.findMany({ 
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' }
    }),
  ]);

  // Construire le tableau complet d'URLs dynamiques
  const allDynamicUrls: MetadataRoute.Sitemap = [
    ...videos.map((v: { slug: string; updatedAt: Date | null }) => ({ url: `${SITE_URL}/videos/${v.slug}`, lastModified: v.updatedAt?.toISOString() })),
    ...actors.map((a: { slug: string; updatedAt: Date | null }) => ({ url: `${SITE_URL}/actors/${a.slug}`, lastModified: a.updatedAt?.toISOString() })),
    ...channels.map((c: { slug: string; updatedAt: Date | null }) => ({ url: `${SITE_URL}/channels/${c.slug}`, lastModified: c.updatedAt?.toISOString() })),
    ...categories.map((cat: { slug: string; updatedAt: Date | null }) => ({ url: `${SITE_URL}/categories/${cat.slug}`, lastModified: cat.updatedAt?.toISOString() })),
  ];

  // Calculer le skip pour les URLs dynamiques (en tenant compte des pages principales dans le chunk 1)
  const mainPagesCount = mainPages.length;
  // Pour le chunk 1, on prend les pages principales + (CHUNK_SIZE - mainPagesCount) URLs dynamiques
  // Pour les autres chunks, on skip les pages principales du chunk 1
  const dynamicSkip = id === 1 ? 0 : skip - mainPagesCount;
  const dynamicTake = id === 1 ? CHUNK_SIZE - mainPagesCount : CHUNK_SIZE;

  // Découper les URLs dynamiques pour ce chunk
  const dynamicUrls = allDynamicUrls.slice(dynamicSkip, dynamicSkip + dynamicTake);

  // On place les pages principales uniquement dans le premier chunk
  return id === 1 ? [...mainPages, ...dynamicUrls] : dynamicUrls;
}