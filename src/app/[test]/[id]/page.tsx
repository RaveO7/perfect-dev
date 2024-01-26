"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo'

export default function Page({ params, searchParams, }: {
    params: { test: string; id: string; }
    searchParams: { page: number }
}) {
    const tableau = ["channel", "pornstar", "categorie"]
    const type = tableau.includes(params.test) ? params.test : "channel"
    const name = decodeURI(params.id).toString()
    const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

    const [videos, setDatasVideos] = useState([]) //Tableaux contenant toutes les vidéos
    const [nbrPage, setNbrPage] = useState(0) //Nombre de pages 1 page contient 48 vidéos
    const [nbrVideos, setNbrVideos] = useState(true) //Nombre de vidéos totale par rapport à la recherche
    const [loading, setLoading] = useState(true) //Affiche Loading le temps de la promesse du fetch()

    useEffect(() => {
        async function getSelectedShoes() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/typeVideos"

                const postData = {
                    method: "POST",
                    header: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: type,
                        name: name,
                        pageNbr: pageNbr,
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                setNbrPage(Math.ceil(res[0] / 48))
                setNbrVideos(res[0])
                setDatasVideos(res[1])
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }
        getSelectedShoes();

    }, [name, pageNbr])

    return (
        <PageListVideo
            valueMenu={""}
            setValueMenu={""}
            videos={videos}
            page={pageNbr}
            numberPage={nbrPage}
            nomGroupe={name}
            nbrVideo={nbrVideos}
            loading={loading}
        />
    )
}