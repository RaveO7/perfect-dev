"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import PageListVideo from '../components/PageListVideo'
import CategoryTags from '../components/CategoryTags'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [valueMenu, setValueMenu] = useState("Latest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [videos, setDatasVideos] = useState([] as any[])
  const [categories, setCategories] = useState([] as Array<{ name: string; imgUrl: string; nbr: number }>)
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false)

  // Fonction pour charger les catégories populaires (randomisées)
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/popularCategories")
      const res = await response.json()
      if (res && res.length > 0) {
        setCategories(res)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, [])

  // Charger les catégories au montage initial
  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  // Réinitialiser et charger la première page quand valueMenu change
  useEffect(() => {
    async function getVideos() {
      try {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
        setLoadingMore(false)
        setShowLoadMoreButton(false)
        
        const apiUrlEndpoint = "/api/homeVideos"

        const postData = createPostRequest({
          pageNbr: 1,
          order: valueMenu,
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
  }, [valueMenu])

  // Fonction pour charger plus de vidéos (scroll automatique)
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages || showLoadMoreButton) return

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
        setDatasVideos(prev => [...prev, ...res])
        const newPage = currentPage + 1
        setCurrentPage(newPage)
        
        // Après chaque 2 chargements (page 2, 4, 6, etc.), afficher les tags et le bouton "Charger plus"
        if (newPage % 2 === 0 && newPage < totalPages) {
          // Recharger les catégories pour avoir un nouvel ordre aléatoire
          loadCategories()
          setShowLoadMoreButton(true)
        }
      }
      setLoadingMore(false)
    }
    catch {
      setLoadingMore(false)
    }
  }, [currentPage, totalPages, valueMenu, loadingMore, showLoadMoreButton])

  // Fonction pour charger plus via le bouton (avec URL pour SEO)
  const handleLoadMoreClick = useCallback(async () => {
    const nextPage = currentPage + 1
    if (nextPage <= totalPages) {
      try {
        setLoadingMore(true)
        const apiUrlEndpoint = "/api/homeVideos"

        const postData = createPostRequest({
          pageNbr: nextPage,
          order: valueMenu,
        })
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        if (res && res.length > 0) {
          setDatasVideos(prev => [...prev, ...res])
          setCurrentPage(nextPage)
          setShowLoadMoreButton(false)
          
          // Mettre à jour l'URL pour le SEO
          router.push(`/?page=${nextPage}`, { scroll: false })
        }
        setLoadingMore(false)
      }
      catch {
        setLoadingMore(false)
      }
    }
  }, [currentPage, totalPages, valueMenu, router])

  // Hook pour le scroll infini (seulement si on n'affiche pas le bouton)
  const scrollTarget = useInfiniteScroll({
    hasMore: currentPage < totalPages && !showLoadMoreButton,
    loading: loadingMore,
    onLoadMore: loadMoreVideos
  })

  // Vérifier si on doit afficher les tags et le bouton (après chaque 2 chargements)
  const shouldShowTagsAndButton = showLoadMoreButton && currentPage % 2 === 0 && currentPage < totalPages && categories.length > 0

  return (
    <>
      <PageListVideo
        valueMenu={valueMenu}
        setValueMenu={setValueMenu}
        videos={videos}
        type={""}
        nbrVideo={0}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={currentPage < totalPages && !showLoadMoreButton}
        scrollTarget={scrollTarget}
      />
      
      {/* Afficher les tags et le bouton "Charger plus" après chaque 2 chargements */}
      {shouldShowTagsAndButton && (
        <div className='w-full px-4 lg:px-0 mb-6'>
          <CategoryTags categories={categories} />
          <div className='w-full flex justify-center mt-6'>
            <button
              onClick={handleLoadMoreClick}
              disabled={loadingMore}
              className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-base font-semibold py-3 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label="Charger plus de vidéos"
            >
              {loadingMore ? 'Chargement...' : 'Charger plus'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
