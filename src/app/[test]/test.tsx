"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo'

export default function Test({ test, page }: any) {

    const tableau = ["channel", "pornstar", "categorie"]
    const type = tableau.includes(test) ? test : "channel"
    const pageNbr: number = page && !isNaN(page) ? Math.abs(page) : 1

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
                        pageNbr: pageNbr
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                if (!res.length) return;

                setDatasVideos(res)
                setNbrPage(Math.ceil(res[0].nbr / 48))
                setNbrVideos(res[0].nbr)
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectedShoes();

    }, [pageNbr])

    return (
        <PageListVideo
            valueMenu={''}
            setValueMenu={''}
            videos={videos}
            page={pageNbr}
            numberPage={nbrPage}
            nomGroupe={type}
            nbrVideo={nbrVideos}
            loading={loading}
        />
    )
}
