"use client"

import React, { useState, useEffect } from 'react'
import PageListVideo from '../components/PageListVideo'

export default function Home({ searchParams }: { searchParams: { page: number } }) {
  const [loading, setLoading] = useState(true)
  const [valueMenu, setValueMenu] = useState("Latest");
  const [nbrPage, setNbrPage] = useState(1)
  const [videos, setDatasVideos] = useState([])

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

        // const responseChat = await fetch('https://chaturbate.com/api/public/affiliates/onlinerooms/?wm=WVA4P&client_ip=request_ip&format=json&gender=f&gender=c&hd=true&exhibitionniste=true&tag=teen&tag=bigboobs&tag=young&offset=1&limit=4')
        // const resChat = await responseChat.json()
        // let test = '';        

        // for (let i = 0; i < resChat.results.length; i++) {
        //   test += resChat.results[i].room_subject + ',§' + resChat.results[i].image_url_360x270 + ',§' + resChat.results[i].chat_room_url + ',§' + resChat.results[i].seconds_online;
        //   if (i !== resChat.results.length - 1) { test += ',§'; }
        // }

        // localStorage.setItem('chat', test)

        await setNbrPage(res[0].nbr)
        await setDatasVideos(res)
        await setLoading(false)
      }
      catch {
        await setLoading(false)
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
      type={""}
      nbrVideo={0}
      loading={loading}
    />
  )
}
