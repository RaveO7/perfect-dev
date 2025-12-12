"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from './PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface InfiniteVideoListProps {
  order: string
  title: string
}

export default function InfiniteVideoList({ order, title }: InfiniteVideoListProps) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [videos, setDatasVideos] = useState([] as any[])

  // Charger la première page
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
          order: order,
        })
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          const numberVideoByPage = 24
          const nbrValue = res[0].nbr
          const calculatedPages = nbrValue > 100 ? Math.ceil(nbrValue / numberVideoByPage) : nbrValue
          setTotalPages(calculatedPages)
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
  }, [order])

  // Fonction pour charger plus de vidéos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const apiUrlEndpoint = "/api/homeVideos"

      const postData = createPostRequest({
        pageNbr: currentPage + 1,
        order: order,
      })
      const response = await fetch(apiUrlEndpoint, postData)
      const res = await response.json()

      if (res && res.length > 0) {
        setDatasVideos(prev => [...prev, ...res])
        setCurrentPage(prev => prev + 1)
      }
      setLoadingMore(false)
    }
    catch {
      setLoadingMore(false)
    }
  }, [currentPage, totalPages, order, loadingMore])

  // Hook pour le scroll infini
  const scrollTarget = useInfiniteScroll({
    hasMore: currentPage < totalPages,
    loading: loadingMore,
    onLoadMore: loadMoreVideos
  })

  return (
    <PageListVideo
      valueMenu={title}
      setValueMenu={() => {}}
      videos={videos}
      type={""}
      nbrVideo={0}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={currentPage < totalPages}
      scrollTarget={scrollTarget}
      showFilter={true}
    />
  )
}

