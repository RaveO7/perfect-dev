import React from 'react'
import BurgerMenuIndexPage from './DroptwonFilter'
import VideoPresentation from './VideoPresentation'
import VideoPresentationSearch from './VideoSearch'
import { upperFirstLetter } from './Utils'
import NavPage from './NavPage'
import Loading from './Loading'
import Nodata from './Nodata'

interface Props {
    valueMenu: any,
    setValueMenu: any,
    videos: any,
    page: any,
    numberPage: any,
    nomGroupe: any,
    nbrVideo: any,
    loading: any,
}

export default function PageListVideo(props: Props) {
    const tableau = ["Latest", "More View", "Most Popular", "A->Z", "Z->A"]
    const valueMenu = props.valueMenu ? tableau.includes(props.valueMenu) ? props.valueMenu : "Latest" : props.valueMenu
    const setValueMenu = props.setValueMenu
    const videos = props.videos
    const page = props.page
    const numberPage = props.numberPage
    const nomGroupe = props.nomGroupe
    const nbrVideo = props.nbrVideo
    const loading = props.loading

    if (loading) return <Loading />
    if (!videos.length) return (<Nodata />)

    return (
        <div className='flex flex-col w-full'>
            {valueMenu ?
                <div className='mx-6 flex flex-col justify-between items-center text-[20px]'>
                    <div className='w-full flex justify-between items-center text-[20px] mb-6'>
                        <h2>{valueMenu + " " + upperFirstLetter("videos")}</h2>
                        <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} />
                    </div>
                </div>
                :
                <div className='w-full flex justify-between items-center text-[20px] mb-6'>
                    <h2 className='text-center text-5xl font-bold'>{upperFirstLetter(nomGroupe)} : {nbrVideo}</h2>
                </div>
            }

            <div className="w-full flex flex-wrap mb-3">
                {!videos[0].name ?
                    videos.map((video: any, id: number) =>
                        <VideoPresentation key={id}
                            id={video.id}
                            type={""}
                            title={video.title}
                            url={video.imgUrl}
                            channels={video.channels}
                            time={video.time}
                            view={video.view}
                            like={video.like}
                            dislike={video.dislike}
                        />
                    )
                    :
                    videos.map((video: any, id: number) =>
                        <VideoPresentationSearch key={id}
                            title={video.name}
                            photo={video.imgUrl}
                            type={nomGroupe}
                        />
                    )
                }
            </div>

            <NavPage page={page} numberPage={numberPage} />
        </div>
    )
}