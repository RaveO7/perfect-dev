"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from '@/components/PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Test({ params, searchParams, }: { params: { type: string; }, searchParams: { page: number } }) {
    const tableau = ["channels", "pornstars", "categories"]
    const type = tableau.includes(params.type) ? params.type : tableau[0]

    const [valueMenu, setValueMenu] = useState("A->Z");
    const [videos, setDatasVideos] = useState([] as any[])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [nbrVideos, setNbrVideos] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    // Réinitialiser quand valueMenu ou type change
    useEffect(() => {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
    }, [valueMenu, type])

    // Charger la première page
    useEffect(() => {
        async function getSelectTypes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/type"

                const postData = createPostRequest({
                    type: type,
                    pageNbr: 1,
                    order: valueMenu,
                })

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                if (res && res.length > 0) {
                    setTotalPages(res[0].nbrPages)
                    setNbrVideos(res[0].nbrTt)
                    // Tous les éléments sont des catégories/channels/pornstars valides
                    setDatasVideos(res)
                    setCurrentPage(1)
                }
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectTypes();
    }, [type, valueMenu])

    // Fonction pour charger plus de vidéos
    const loadMoreVideos = useCallback(async () => {
        if (loadingMore || currentPage >= totalPages) return

        try {
            setLoadingMore(true)
            const apiUrlEndpoint = "/api/type"

            const postData = createPostRequest({
                type: type,
                pageNbr: currentPage + 1,
                order: valueMenu,
            })

            const response = await fetch(apiUrlEndpoint, postData)
            const res = await response.json()

            if (res && res.length > 0) {
                // Tous les éléments sont des catégories/channels/pornstars valides
                setDatasVideos(prev => [...prev, ...res])
                setCurrentPage(prev => prev + 1)
            }
            setLoadingMore(false)
        }
        catch {
            setLoadingMore(false)
        }
    }, [currentPage, totalPages, valueMenu, loadingMore, type])

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
            categoryType={type}
        />
    )
}