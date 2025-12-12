"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from './PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

interface InfiniteCategoryListProps {
  categoryType: string // "channels", "pornstars", "categories"
  order: string
  title: string
}

export default function InfiniteCategoryList({ categoryType, order, title }: InfiniteCategoryListProps) {
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [nbrVideos, setNbrVideos] = useState(0)
  const [videos, setDatasVideos] = useState([] as any[])

  // Charger la première page
  useEffect(() => {
    async function getCategories() {
      try {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
        setLoadingMore(false)
        
        const apiUrlEndpoint = "/api/type"

        const postData = createPostRequest({
          type: categoryType,
          pageNbr: 1,
          order: order,
        })

        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          setTotalPages(res[0].nbrPages)
          setNbrVideos(res[0].nbrTt)
          setDatasVideos(res)
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

    getCategories();
  }, [categoryType, order])

  // Fonction pour charger plus de catégories
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages) return

    try {
      setLoadingMore(true)
      const apiUrlEndpoint = "/api/type"

      const postData = createPostRequest({
        type: categoryType,
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
  }, [currentPage, totalPages, order, loadingMore, categoryType])

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
      type={categoryType}
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

