"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from '@/components/PageListVideo';
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function SearchPage({ params, searchParams, }: {
  params: { type: string, name: string; };
  searchParams: { page: number }
}) {
  const type = params.type
  const search = decodeURI(params.name)

  const [videos, setDatasVideos] = useState([] as any[])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [nbrVideos, setNbrVideos] = useState(0);
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [valueMenu, setValueMenu] = useState("Latest");

  // Réinitialiser quand valueMenu, type ou search change
  useEffect(() => {
    setCurrentPage(1)
    setDatasVideos([])
    setLoading(true)
  }, [valueMenu, type, search])

  // Charger la première page
  useEffect(() => {
    async function getPageData() {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/searchVideos"
        const postData = createPostRequest({
          type: type,
          search: search,
          pageNbr: 1,
          order: valueMenu,
        })
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          setTotalPages(res[0].nbrPage || 0)
          setNbrVideos(res[0].nbr || 0)
          // Retirer le premier élément qui contient les métadonnées
          const videosData = res.filter((item: any) => item.title || item.name)
          setDatasVideos(videosData)
          setCurrentPage(1)
        } else {
          setTotalPages(0)
          setNbrVideos(0)
          setDatasVideos([])
        }
        setLoading(false)
      }
      catch {
        setLoading(false)
        return;
      }
    }
    getPageData();
  }, [type, search, valueMenu]);

  // Fonction pour charger plus de vidéos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const apiUrlEndpoint = "/api/searchVideos"
      const postData = createPostRequest({
        type: type,
        search: search,
        pageNbr: currentPage + 1,
        order: valueMenu,
      })
      const response = await fetch(apiUrlEndpoint, postData)
      const res = await response.json()

      if (res && res.length > 0) {
        // Retirer le premier élément qui contient les métadonnées
        const newVideos = res.filter((item: any) => item.title || item.name)
        setDatasVideos(prev => [...prev, ...newVideos])
        setCurrentPage(prev => prev + 1)
      }
      setLoadingMore(false)
    }
    catch {
      setLoadingMore(false)
    }
  }, [currentPage, totalPages, valueMenu, loadingMore, type, search])

  // Hook pour le scroll infini
  const scrollTarget = useInfiniteScroll({
    hasMore: currentPage < totalPages,
    loading: loadingMore,
    onLoadMore: loadMoreVideos
  })

  return (
    <PageListVideo
      valueMenu={valueMenu}
      setValueMenu={setValueMenu}
      videos={videos}
      type={type}
      nbrVideo={nbrVideos}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={currentPage < totalPages}
      scrollTarget={scrollTarget}
    />
  )
}
