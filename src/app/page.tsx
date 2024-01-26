"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '../components/PageListVideo'

export default function Home({ searchParams, }: { searchParams: { page: number } }) {
  const [valueMenu, setValueMenu] = useState("Latest");
  const [videos, setDatasVideos] = useState([])
  const [nbrPage, setNbrPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

  useEffect(() => {
    async function getVideos() {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/homeVideos"
        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNbr: pageNbr,
            order: valueMenu,
          })
        }

        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        await setNbrPage(Math.ceil(res[0].nbr / 48))
        await setDatasVideos(res)
        setLoading(false)
      }
      catch {
        setLoading(false)
        return;
      }
    }

    getVideos();

  }, [pageNbr, valueMenu])

  return (
    <PageListVideo
      valueMenu={valueMenu}
      setValueMenu={setValueMenu}
      videos={videos}
      page={pageNbr}
      numberPage={nbrPage}
      nomGroupe={""}
      nbrVideo={""}
      loading={loading}
    />
  )
}