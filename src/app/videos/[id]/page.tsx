"use client"

import Separateur from '@/components/Separateur'
import VideoPresentation from '@/components/VideoPresentation';
import React, { useState, useEffect } from 'react'
import { FaFlag } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { IoMdThumbsDown } from "react-icons/io";
import TimeDifference, { getCookie, getRating, setCookie, upperFirstLetter } from '@/components/Utils';
import DropDown from '@/components/DroptownMenuEpurate';
import Link from 'next/link';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function Videos({ params, searchParams, }: {
  params: { id: number | string; }
  searchParams: { name: string }
}) {
  const [dataVideo, setDataVideo] = useState([] as any)
  const [dataMoreVideo, setDataMoreVideo] = useState([])
  const [dataNbrVideo, setDataNbrVideo] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [player, setPlayer] = useState(0);
  let id = params.id
  if (id == "random") { id = Math.floor(Math.random() * 74) + 1; }
  const [cookieLike, setCookieLike] = useState<any>('');
  const [repport, setRepport] = useState<any>('false');

  useEffect(() => {
    const getSelectedVideo = async () => {
      try {
        setLoading(true)
        const apiUrlEndpoint = "/api/video"

        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id
          })
        }
        const response = await fetch(apiUrlEndpoint, postData)
        const res = await response.json()

        setDataNbrVideo(res[0])
        setDataVideo(res[1])
        setDataMoreVideo(res[2])
        setLoading(false)
      }
      catch {
        setLoading(false)
        return;
      }
    }

    async function getAddOneView() {
      try {
        const apiUrlEndpoint = "/api/addViewVideo"

        const postData: any = {
          method: "POST",
          header: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id
          })
        }
        await fetch(apiUrlEndpoint, postData)
      }
      catch { return; }
    }

    getSelectedVideo();

    if (!getCookie(id)) { setCookie(id, 'true', 7, '/videos/' + id); getAddOneView(); }

  }, [])
  useEffect(() => {
    if (getCookie(id + 'like')) {
      setCookieLike(getCookie(id + 'like'))
    }
    if (getCookie(id + 'repport')) {
      setRepport(getCookie(id + 'repport'))
    }
  }, [cookieLike, repport])

  if (isLoading) return <Loading />
  if (!dataVideo) return <Nodata />

  const title: string = dataVideo.title;
  const videos: Array<string> = modifierLiens(dataVideo.videoUrl.split(','));
  const channel: string = dataVideo.channels.replace(/,.*$/, '')
  const acteurs: Array<string> = dataVideo.actors.split(',');
  const tags: Array<string> = dataVideo.categories.split(',');

  const like: number = dataVideo.like
  let dislike: number = dataVideo.dislike
  const nbrView: number = dataVideo.view
  let date: string = dataVideo.createdAt
  date = TimeDifference({ date })
  const rating: number = getRating(like, dislike)

  function modifierLiens(liens: Array<string>) {
    // Parcourir le tableau
    for (let i = 0; i < liens.length; i++) {
      // Vérifier si l'élément commence par "https://streamtape.com/v/"
      if (liens[i].startsWith("https://streamtape")) {

        // Remplacer "/v/" par "/e/"
        liens[i] = liens[i].replace("/v/", "/e/");
      }
    }

    // Retourner les liens mis à jour
    return liens;
  }
  const addValVideoData = async (val: string) => {
    // try {
    //   const apiUrlEndpoint = "/api/addViewVideo"

    //   const postData: any = {
    //     method: "POST",
    //     header: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       id: id,
    //       val: val
    //     })
    //   }
    //   await fetch(apiUrlEndpoint, postData)
    // }
    // catch { return; }
  }
  function setUpdate(val: string) {
    switch (val) {
      case 'l':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'true') {
          setCookieLike('true')
          setCookie(id + 'like', 'true', 31, '/videos/' + id);
          // addValVideoData(val);
        } else {
          console.log("test")
          setCookieLike('')
        }
        break;
      case 'd':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'false') {
          setCookieLike('false')
          setCookie(id + 'like', 'false', 31, '/videos/' + id);
          // addValVideoData(val);
        }
        break;
      case 'r':
        if (!getCookie(id + 'repport')) {
          setRepport('true')
          setCookie(id + 'repport', 'true', 31, '/videos/' + id);
          // addValVideoData(val);
        }
        break;
    }
  }

  const helmetContext = {};

  return (
    <div className='w-full flex flex-col'>
      <HelmetProvider context={helmetContext}>
        <Helmet prioritizeSeoTags>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      {videos[1] && <DropDown video={modifierLiens(videos)} setPlayer={setPlayer} />}
      <div className='flex w-full mb-2'>
        <div className='border-[1px] border-blue-300 w-[100%] md:w-[75%] aspect-video h-full bg-gray-950'>
          <iframe id="monIframe" className='w-full h-full'
            title={'Video ' + title}
            allowFullScreen allow="autoplay" scrolling="no" frameBorder="0"
            src={videos[player]}></iframe>
        </div>

        <div className='max-w-[25%] w-full md:flex hidden flex-col justify-between bg-green-500'>
          <h2 className='text-center font-extrabold text-black'>Pubed</h2>
        </div>
      </div>

      <div className='flex'>
        <div className='w-[100%] md:w-[75%] h-full p-2'>
          <div>
            <h2 className="max-w-full mb-2 text-xl">{upperFirstLetter(title)}</h2>
            <div className='flex flex-col mm:flex-row items-center justify-between text-sm text-infoVideo'>
              <div className='flex items-center '>
                <p>{nbrView} Vues</p>

                <Separateur />

                <div className='flex items-center'><IoMdThumbsUp className="mr-1" /> {Math.ceil(rating)} %</div>

                <Separateur />

                <div>Il y a {date}</div>

              </div>

              <div className='flex items-center gap-1 text-xl'>
                <button role="button" name="like" aria-labelledby={'Button Add Like Number Like' + like} aria-label={'Button Add Like Number Like' + like} className=
                  {`${cookieLike == 'true' ? "text-blue-500" : "hover:text-blue-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('l')}> <IoMdThumbsUp className="mr-1" />{getCookie(id + 'like') == 'true' ? like + 1 : like}</button>
                <Separateur />
                <button role="button" name="dislike" aria-labelledby={'Button Add Dislike Number Like' + like} aria-label={'Button Add Dislike Number Like' + like} className=
                  {`${cookieLike == 'false' ? "text-red-500" : "hover:text-red-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('d')}> <IoMdThumbsDown className="mr-1" />{getCookie(id + 'like') == 'false' ? dislike + 1 : dislike}</button>
                <Separateur />
                <button role="button" name="repport" aria-labelledby='Repport Video' aria-label='Repport Video' className=
                  {`${repport == 'true' ? "text-red-700" : "hover:text-red-700"} flex items-center duration-300`}

                  onClick={() => setUpdate('r')}> <FaFlag className="mr-2" /> <span className='block mm:hidden md:block'>Repport</span></button>
              </div>
            </div>

            <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>

            <div className='w-full flex flex-col'>
              <div className='flex justify-start'>

                {channel.length > 0 &&
                  <Link href={'/channel/' + channel} className=' hover:text-red-500 px-2 mx-2 flex flex-col justify-center items-center hover:bg-bgTimeVideo hover:cursor-pointer rounded-xl'>
                    <h3 className='text-[25px] text-center'>{upperFirstLetter(channel)}</h3>
                    <p className='text-dessous text-xs mb-[5px] mt-2'>{dataNbrVideo} Videos</p>
                  </Link>
                }

                <div className='flex-1 w-full max-h-[107px] overflow-hidden '>
                  {acteurs[0].length !== 0 &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Pornstars</p>

                      {acteurs.map((actor, id) => (
                        actor && <Link href={'/pornstar/' + actor} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {upperFirstLetter(actor)}
                        </Link>
                      ))}
                    </>
                  }
                  {(acteurs[0].length == 0 && tags[0].length > 0) &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Categories</p>
                      {tags.map((categorie: string, id: React.Key) => (
                        categorie && <Link href={'/categorie/' + categorie} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {upperFirstLetter(categorie)}
                        </Link>
                      ))}
                    </>
                  }
                </div>
              </div>

              {(acteurs[0].length !== 0 && tags[0].length > 0) &&
                <>
                  <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>
                  <div>
                    <p className='text-dessous text-[15px] mb-[5px]'>Categories</p>
                    {tags.map((categorie: string, id: React.Key) => (
                      categorie && <Link href={'/categorie/' + categorie} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                        {upperFirstLetter(categorie)}
                      </Link>
                    ))}
                  </div>
                </>
              }
            </div>

            <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>

            <div className="w-full flex flex-wrap mb-3">
              {dataMoreVideo.slice(0, 9).map((video: any, id: number) =>
                <VideoPresentation key={id}
                  type={"video"}
                  id={video.id}
                  title={video.title}
                  url={video.imgUrl}
                  channels={video.channels}
                  time={video.time}
                  view={video.view}
                  like={video.like}
                  dislike={video.dislike}
                />
              )}
            </div>
          </div>

        </div>
        <div className='max-w-[25%] md:flex hidden flex-col justify-between bg-green-500 w-full'>
          <h2 className='text-center font-extrabold text-black'>Pubed</h2>
        </div>
      </div>

      {/* <div className=
        {`${pubOpen ? "block" : "hidden"} w-[90%] h-44 fixed right-0 bottom-0 md:hidden bg-green-500`}>
        <button aria-label='close pop-up' className='text-black' onClick={() => setPubOpen((val: any) => !val)}>X</button>
      </div> */}
    </div >
  )
}