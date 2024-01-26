"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '@/components/PageListVideo';

export default function SearchPage({ params, searchParams, }: {
  params: { type: string, name: string; }
  searchParams: { page: number }
}) {
  const type = params.type
  const search = decodeURI(params.name)
  const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

  const [videos, setDatasVideos] = useState([])
  const [nbrPage, setNbrPage] = useState(0)
  const [nbrVideos, setNbrVideos] = useState();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getPageData() {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/searchVideos"
        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: type,
            search: search,
            pageNbr: pageNbr,
          })
        }
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

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
    getPageData();

  }, [pageNbr]);

  return (
    <PageListVideo
      valueMenu={""}
      setValueMenu={""}
      videos={videos}
      page={pageNbr}
      numberPage={nbrPage}
      nomGroupe={type}
      nbrVideo={nbrVideos}
      loading={loading}
    />
  )
}