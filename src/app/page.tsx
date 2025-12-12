"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import PageListVideo from '../components/PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Home({ searchParams }: { searchParams: { page: number } }) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [valueMenu, setValueMenu] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [videos, setDatasVideos] = useState([] as any[])

  // Réinitialiser et charger la première page quand valueMenu change
  useEffect(() => {
    async function getVideos() {
      try {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
        setLoadingMore(false)
        
        const apiUrlEndpoint = "/api/homeVideos"

        const postData = createPostRequest({
          pageNbr: 1,
          order: valueMenu,
        })
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          // L'API devrait retourner nbr comme nombre de pages, mais si c'est > 100, c'est le nombre total de vidéos
          const numberVideoByPage = 24
          const nbrValue = res[0].nbr
          // Si nbr est > 100, calculer le nombre de pages
          const calculatedPages = nbrValue > 100 ? Math.ceil(nbrValue / numberVideoByPage) : nbrValue
          setTotalPages(calculatedPages)
          // Tous les éléments sont des vidéos valides (tous ont un title)
          setDatasVideos(res)
          setCurrentPage(1)
        } else {
          setTotalPages(1)
          setDatasVideos([])
        }
        setLoading(false)
      }
      catch {
        setLoading(false)
        setTotalPages(1)
        return;
      }
    }

    getVideos();
  }, [valueMenu])

  // Fonction pour charger plus de vidéos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const apiUrlEndpoint = "/api/homeVideos"

      const postData = createPostRequest({
        pageNbr: currentPage + 1,
        order: valueMenu,
      })
      const response = await fetch(apiUrlEndpoint, postData)
      const res = await response.json()

      if (res && res.length > 0) {
        // Tous les éléments sont des vidéos valides (tous ont un title)
        setDatasVideos(prev => [...prev, ...res])
        setCurrentPage(prev => prev + 1)
      }
      setLoadingMore(false)
    }
    catch {
      setLoadingMore(false)
    }
  }, [currentPage, totalPages, valueMenu, loadingMore])

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
      type={""}
      nbrVideo={0}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={currentPage < totalPages}
      scrollTarget={scrollTarget}
    />
  )
}
