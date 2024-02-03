"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import Image from 'next/image';

import Separateur from '@/components/Separateur'
import VideoPresentation from '@/components/VideoPresentation';
import TimeDifference, { deleteCookie, formatString, getCookie, getRating, setCookie, upperFirstLetter } from '@/components/Utils';
import DropDown from '@/components/DroptownMenuEpurate';
import Loading from '@/components/Loading';
import Nodata from '@/components/Nodata';
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { FaFlag } from "react-icons/fa";
import VideoPresentationTest from '@/components/VideoPresentationTest';
import ImgAi1 from '@/app/assets/images/GirlFriendAi160x600.webp'
import ImgAi2 from '@/app/assets/images/SextingAI160x600.webp'

export default function Videos({ params, searchParams }: { params: { id: number }, searchParams: { name: string } }) {
  const [dataVideo, setDataVideo] = useState([] as any)
  const [dataMoreVideo, setDataMoreVideo] = useState([])
  const [dataNbrVideo, setDataNbrVideo] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [player, setPlayer] = useState(0);
  const [cookieLike, setCookieLike] = useState<any>('');
  const [repport, setRepport] = useState<any>('false');

  const id = params.id
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

    if (!getCookie(id)) { setCookie(id, 'true', 7, '/'); getAddOneView(); }

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

  function setUpdate(val: string) {
    switch (val) {
      case 'l':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'true') {
          setCookieLike('true')
          setCookie(id + 'like', 'true', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setCookieLike('')
          deleteCookie(id + 'like', '/videos/' + id)
        }
        break;
      case 'd':
        if (!getCookie(id + 'like') || getCookie(id + 'like') !== 'false') {
          setCookieLike('false')
          setCookie(id + 'like', 'false', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setCookieLike('')
          deleteCookie(id + 'like', '/videos/' + id)
        }
        break;
      case 'r':
        if (!getCookie(id + 'repport')) {
          setRepport('true')
          setCookie(id + 'repport', 'true', 31, '/videos/' + id);
          addValVideoData(val);
        } else {
          setRepport('')
          deleteCookie(id + 'repport', '/videos/' + id)
        }
        break;
    }
  }

  async function addValVideoData(value: any) {
    try {
      const apiUrlEndpoint = "/api/addValVideoData"
      const postData: any = {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          cookie: value,
        })
      }
      await fetch(apiUrlEndpoint, postData)
    }
    catch {
      setLoading(false)
      return;
    }
  }

  return (
    <div className='w-full flex flex-col'>
      {videos[1] && <DropDown video={modifierLiens(videos)} setPlayer={setPlayer} />}
      <div className='flex w-full mb-2'>
        <div className=' border-[1px] border-blue-300 w-[100%] md:w-[75%] aspect-video h-full bg-gray-950'>
          <iframe id="monIframe" className='w-full h-full'
            title={'Video ' + title}
            allowFullScreen allow="autoplay" scrolling="no" frameBorder="0"
            src={videos[player]}
          >
          </iframe>
        </div>

        <div className='max-w-[25%] w-full hidden md:flex flex-col relative'>
          <Link className='flex justify-around h-full' href='https://candy.ai?via=hamelio73' rel='preload'>
            <Image
              className='hidden xl:block absolute xl:relative left-0 top-0'
              src={ImgAi1}
              alt='Candy.ai Image'
              width={160}
              height={600}
              quality={100}
              priority={true}
            />
            <Image
              className='hidden md:block absolute xl:relative right-4 lg:right-0 top-0'
              src={ImgAi2}
              alt='Candy.ai Image'
              width={160}
              height={600}
              quality={100}
              priority={true}
            />
          </Link>
        </div>
      </div>

      <div className='flex'>
        <div className='w-[100%] md:w-[75%] h-full p-2'>
          <div>
            <Link className='w-fullblock md:hidden' href='https://candy.ai?via=hamelio73'>
              <Image
                className='min-w-[300px] w-[75%] m-auto'
                src='
                https://lh3.googleusercontent.com/fife/AGXqzDn0ZEP9TE-aVAwIwoAAqdnCS9amVngCGGnugs_Dqs-Lng9cghF9NEWc7I_DZTUCcACv0Z1Je11xoV01R5y2zkSzgi8KHlu_xX_1td8gP4MCtVEeXgLdXTdq6bLiSiMuVNxlXIlhYj1YDxYl6RgpigRfpd70xN_6ShnoH0YPD6JofMQsPTV_Y-J8YXfSBOIaKY-4fRh8hPn76DzAple6BVmg8BJz06ob7LE3H9TDHzOVr_ENwjX2glJjyiIC3hgzD4-4xMUX_n9mCa1wr7ALJ453S3cCqDQ5Xw1aLFsl4RWdJ2wCQI-DpJJ8u_aS0k1RMHvxmjf5oV91chZpPuDNFwe1P8Z9UftwN7HfHH9n-9qoTBCn4g6Ba3UOIL4zHkYrBbPDlJcY0CM46nINBteIurO-D7AcGpzfyiEG5UVW43dvLE6N3OggT0bKsLCI_N2-U10f6EYRqB6zcPcuSVgm-B15zyybNf4i_D8-PDDhtk03nfWpu4wL_VoNRV4Uf1bqxGb25fpATRTk_sqNpaz3zJ3tYR2rAILsg3OfSFYPTqzkkeIMZVba9b3RKM61WTfsxZTVThzqxXiNE8moNFuIqZvXiZcEv4qf--3oLLoPNzkUiBgGNsYso6-kqBtCQ0AKK7YHqN6IzfxyAx87pAdNvz1e83Hl_rGrORpikwqnRi-sTQhhK4xHWzH1teCX2pwQO-hf9eSaMOAgXxbNM0ngeTipSW9Myxom1fj2O5RyjYNTS-vpDxtMg5BhGy42ySKDU0MKJpOLkIXwhIpniynJ8YpGVqTGu9-hhPGfZ7LdnJLM3iB1ulm9u2eNoyVumi1D6wK_AScUdCycluUIfabmOB8tJA5Gu4vqjl-hbYL0woVezXxSAhzzrSlpeoBnoKznCG8NxQ69ddYMKP75HpBSHtqEqHVrcOhU3Gl809sbk-q4qeXq23iyj8bw_QGk8QP9j-jAhlw77t5UONJ3prnsmRuH7ligoYFdUtJPkGswGIT_DNtHLt3A_hwPKahAQ1Syj8uIiYAnetCVQBA8vomHyOJQKdke0Hbsle5njBZWWedCF4FQJdb50AEOoSF6K1_uCUCkiHZDkRzPemNCP9IbmfdtNCOV7VQJYMGMgMUp6DXN2049Tgyq4f8sDpEIYeCGM2RcCFETgImzms3ScOFs9QtDcSLWEJUmlp0AJYdhQPvach81INlxTSOVyqnoX_O2ohLFttioyf71dpFMMgjyhfyU5gi_msMh-AMewbVM4gGeOnvxlRC6XU4JjLK1WchI5Gena7watJ_1J4ZVvQPYQzj04_G10wZKDde_kE3Nw9Ls4s2_SG4LwrVmfWpON43r7O3g-J0ZBXy16_owSgQ1U4k25Pcvzbu6bU8-UrkodEUxQsVlOoUDazEb8NUEdTrjajoIPrElgR9lLcN_pT9iq00GinPMYJNV6CMqdrQHfxuQNseMCd_SNMjbxO9fc0U1htsgedAbfbDMfLar4E0G2qF00bGpDNIBRfFnuOo77VSNgdTrbW_DFQcbXK5B38XOmkbRqtU2LgFQ_N7Uzh50kbs3QzkJM7_Ty4D9e5jPMZKGhkGDOBY=w1872-h958
                '
                alt='Candy.ai Image'
                width={300}
                height={100}
                quality={100}
                priority={true}
              />
            </Link>
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
                <button role="button" name="like" aria-label={'Button Add Like Number Like ' + like} className=
                  {`${cookieLike == 'true' ? "text-blue-500" : "hover:text-blue-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('l')}>
                  {/* Si like add 1 aux like */}
                  <IoMdThumbsUp className="mr-1" />{cookieLike == 'true' ? like + 1 : like}</button>
                <Separateur />
                <button role="button" name="dislike" aria-label={'Button Add Dislike Number Like' + dislike} className=
                  {`${cookieLike == 'false' ? "text-red-500" : "hover:text-red-500"} flex items-center duration-300`}
                  onClick={() => setUpdate('d')}>
                  {/* Si disLike add 1 aux disLike */}
                  <IoMdThumbsDown className="mr-1" />{cookieLike == 'false' ? dislike + 1 : dislike}</button>
                <Separateur />
                <button role="button" name="repport" aria-label='Repport Video' className=
                  {`${repport == 'true' ? "text-red-700" : "hover:text-red-700"} flex items-center duration-300`}
                  onClick={() => setUpdate('r')}> <FaFlag className="mr-2" /> <span className='block mm:hidden md:block'>Repport</span>
                </button>
              </div>
            </div>

            <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>

            <div className='w-full flex flex-col'>
              <div className='flex justify-start'>

                {channel.length > 0 &&
                  <Link href={'/channel/' + channel} className=' hover:text-red-500 px-2 mx-2 flex flex-col justify-center items-center hover:bg-bgTimeVideo hover:cursor-pointer rounded-xl'>
                    <h3 className='text-[25px] text-center'>{formatString(channel)}</h3>
                    <p className='text-dessous text-xs mb-[5px] mt-2'>{dataNbrVideo} Videos</p>
                  </Link>
                }

                <div className='flex-1 w-full max-h-[107px] overflow-hidden '>
                  {acteurs[0].length !== 0 &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Pornstars</p>

                      {acteurs.map((actor, id) => (
                        actor && <Link href={'/pornstar/' + actor} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {formatString(actor)}
                        </Link>
                      ))}
                    </>
                  }
                  {(acteurs[0].length == 0 && tags[0].length > 0) &&
                    <>
                      <p className='text-dessous text-[15px] mb-[5px]'>Categories</p>
                      {tags.map((categorie: string, id: React.Key) => (
                        categorie && <Link href={'/categorie/' + categorie} key={id} className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] mr-1 inline-block  mb-1'>
                          {formatString(categorie)}
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
                        {formatString(categorie)}
                      </Link>
                    ))}
                  </div>
                </>
              }
            </div>

            <div className='w-full border-b-2 opacity-10 border-red-50 my-3'></div>

            <div className="w-full flex flex-wrap mb-3">
              {dataMoreVideo.slice(0, 9).map((video: any, id: number) =>
                <VideoPresentationTest key={id}
                  keyId={id}
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
        {/* <div className='max-w-[25%] md:flex hidden flex-col justify-between bg-green-500 w-full'>
          <h2 className='text-center font-extrabold text-black'>Pubed</h2>
        </div> */}
      </div>
    </div >
  )
}