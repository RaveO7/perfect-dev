"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo'

export default function Test({ params, searchParams, }: {
    params: { test: string; }
    searchParams: { page: number }
}) {

    const tableau = ["channel", "pornstar", "categorie"]
    const [valueMenu, setValueMenu] = useState("A->Z");
    const type = tableau.includes(params.test) ? params.test : "channel"
    const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

    const [videos, setDatasVideos] = useState([])
    const [nbrPage, setNbrPage] = useState(0)
    const [nbrVideos, setNbrVideos] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getSelectedShoes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/type"

                const postData: any = {
                    method: "POST",
                    header: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: type,
                        pageNbr: pageNbr,
                        order: valueMenu,
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                if (!res.length) return;

                setDatasVideos(res)
                setNbrPage(res[0].nbrPages)
                setNbrVideos(res[0].nbrTt)
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectedShoes();

    }, [pageNbr, valueMenu])

    return (
        <PageListVideo
            valueMenu={valueMenu}
            setValueMenu={setValueMenu}
            videos={videos}
            page={pageNbr}
            numberPage={nbrPage}
            nomGroupe={type}
            nbrVideo={nbrVideos}
            loading={loading}
        />
    )
}