"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from './PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface InfiniteCategoryVideoListProps {
  categoryType: string // "channel", "pornstar", "categorie"
  categoryName: string // Nom de la catégorie
  order: string
  title: string
}

export default function InfiniteCategoryVideoList({ categoryType, categoryName, order, title }: InfiniteCategoryVideoListProps) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [nbrVideos, setNbrVideos] = useState(0)
  const [videos, setDatasVideos] = useState([] as any[])

  // Charger la première page
  useEffect(() => {
    async function getVideos() {
      try {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
        setLoadingMore(false)
        
        const apiUrlEndpoint = "/api/typeVideos"

        const postData = createPostRequest({
          type: categoryType,
          name: categoryName,
          pageNbr: 1,
          order: order,
        })

        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          setTotalPages(res[0].page)
          setNbrVideos(res[0].nbr)
          const videosData = res.filter((item: any) => item.title)
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
        setTotalPages(0)
        return;
      }
    }

    getVideos();
  }, [categoryType, categoryName, order])

  // Fonction pour charger plus de vidéos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const apiUrlEndpoint = "/api/typeVideos"

      const postData = createPostRequest({
        type: categoryType,
        name: categoryName,
        pageNbr: currentPage + 1,
        order: order,
      })

      const response = await fetch(apiUrlEndpoint, postData)
      const res = await response.json()

      if (res && res.length > 0) {
        const newVideos = res.filter((item: any) => item.title)
        setDatasVideos(prev => [...prev, ...newVideos])
        setCurrentPage(prev => prev + 1)
      }
      setLoadingMore(false)
    }
    catch {
      setLoadingMore(false)
    }
  }, [currentPage, totalPages, order, loadingMore, categoryType, categoryName])

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
      type={categoryName}
      nbrVideo={nbrVideos}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={currentPage < totalPages}
      scrollTarget={scrollTarget}
      showFilter={true}
      categoryType={categoryType}
    />
  )
}

