import React from 'react'
import BurgerMenuIndexPage from './DroptwonFilter'
import VideoPresentationSearch from './VideoSearch'
import { formatString, upperFirstLetter } from './Utils'
import NavPage from './NavPage'
import Loading from './Loading'
import Nodata from './Nodata'
import VideoPresentationTest from './VideoPresentationTest'

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
    const setValueMenu = props.setValueMenu
    const videos = props.videos
    const page = props.page
    const numberPage = props.numberPage
    const nomGroupe = props.nomGroupe
    const nbrVideo = props.nbrVideo
    const loading = props.loading

    if (loading) return <Loading />
    if (!videos.length) return (<Nodata />)

    let list
    if (!videos[0].title) {
        list = [
            "Latest",
            "A->Z",
            "Z->A",
        ];
    }
    else {
        list = [
            "Latest",
            "More View",
            "Most Popular",
            "A->Z",
            "Z->A",
        ];
    }

    const valueMenu = props.valueMenu ? list.includes(props.valueMenu) ? props.valueMenu : "Latest" : props.valueMenu

    return (
        <div className='flex flex-col w-full'>
            {!nomGroupe ?
                <div className='mx-6 flex flex-col justify-between items-center text-[20px]'>
                    <div className='w-full flex justify-between items-center text-[20px] mb-6'>
                        <h2>{valueMenu + " " + upperFirstLetter("videos")}</h2>
                        <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} />
                    </div>
                </div>
                :
                <div className='w-full flex justify-between items-center text-[20px] mb-6 px-2 md:px-0'>
                    {!videos[0].title ?
                        <h2 className='text-center text-2xl md:text-5xl font-bold'>{upperFirstLetter(nomGroupe) + 's'} : {nbrVideo}</h2>
                        :
                        <h2 className='text-center text-xl md:text-5xl font-bold'>{formatString(nomGroupe)} : {nbrVideo}</h2>
                    }
                    {valueMenu && <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} />}

                </div>
            }

            <div className="w-full flex flex-wrap mb-3">
                {videos[0].title ?
                    videos.map((video: any, id: number) =>
                        <VideoPresentationTest key={id}
                            keyId={id}
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
                            keyId={id}
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