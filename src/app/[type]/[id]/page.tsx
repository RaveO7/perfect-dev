"use client"

import React, { useState, useEffect, useCallback } from 'react'
import PageListVideo from '@/components/PageListVideo'
import { createPostRequest } from '@/lib/api-helpers'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export default function Page({ params, searchParams, }: {
    params: { type: string; id: string; };
    searchParams: { page: number }
}) {
    const tableau = ["channel", "pornstar", "categorie"]
    const [valueMenu, setValueMenu] = useState("Latest");
    const type = tableau.includes(params.type) ? params.type : "channel"
    const name = decodeURI(params.id).toString()

    const [videos, setDatasVideos] = useState([] as any[])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [nbrVideos, setNbrVideos] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    // Réinitialiser quand valueMenu ou name change
    useEffect(() => {
        setCurrentPage(1)
        setDatasVideos([])
        setLoading(true)
    }, [name, valueMenu])

    // Charger la première page
    useEffect(() => {
        async function getSelectedShoes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/typeVideos"

                const postData = createPostRequest({
                    type: type,
                    name: name,
                    pageNbr: 1,
                    order: valueMenu,
                })

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                if (res && res.length > 0) {
                    setTotalPages(res[0].page)
                    setNbrVideos(res[0].nbr)
                    // Retirer le premier élément qui contient les métadonnées
                    const videosData = res.filter((item: any) => item.title)
                    setDatasVideos(videosData)
                    setCurrentPage(1)
                }
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectedShoes();
    }, [name, valueMenu, type])

    // Fonction pour charger plus de vidéos
    const loadMoreVideos = useCallback(async () => {
        if (loadingMore || currentPage >= totalPages) return

        try {
            setLoadingMore(true)
            const apiUrlEndpoint = "/api/typeVideos"

            const postData = createPostRequest({
                type: type,
                name: name,
                pageNbr: currentPage + 1,
                order: valueMenu,
            })

            const response = await fetch(apiUrlEndpoint, postData)
            const res = await response.json()

            if (res && res.length > 0) {
                // Retirer le premier élément qui contient les métadonnées
                const newVideos = res.filter((item: any) => item.title)
                setDatasVideos(prev => [...prev, ...newVideos])
                setCurrentPage(prev => prev + 1)
            }
            setLoadingMore(false)
        }
        catch {
            setLoadingMore(false)
        }
    }, [currentPage, totalPages, valueMenu, loadingMore, type, name])

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
            type={name}
            nbrVideo={nbrVideos}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={currentPage < totalPages}
            scrollTarget={scrollTarget}
            categoryType={type}
        />
    )
}
