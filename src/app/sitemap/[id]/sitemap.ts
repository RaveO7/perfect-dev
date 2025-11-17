import type { MetadataRoute } from "next";
import { generateSitemapChunk } from "../../sitemap";

export default async function sitemap({
  params,
}: {
  params: { id: string };
}): Promise<MetadataRoute.Sitemap> {
  return generateSitemapChunk(Number(params.id));
}