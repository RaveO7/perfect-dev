import React from 'react'
import BurgerMenuIndexPage from './DroptwonFilter'
import { upperFirstLetter } from './Utils'
import NavPage from './NavPage'
import Loading from './Loading'
import Nodata from './Nodata'
import Galery from './Galery'

interface Props {
    valueMenu: string,
    setValueMenu: any,
    videos: any,
    page: number,
    numberPage: number,
    nomGroupe: string,
    nbrVideo: any,
    loading: any,
}

export default function PageListVideo(props: Props) {
    const setValueMenu = props.setValueMenu
    const videos = props.videos
    const page = props.page
    const numberPage = props.numberPage
    const type = props.nomGroupe
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
            {!type ?
                <div className='mx-6 flex flex-col justify-between items-center text-[20px]'>
                    <div className='w-full flex justify-between items-center text-[20px] mb-6'>
                        <h2>{valueMenu + " " + upperFirstLetter("videos")}</h2>
                        <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} />
                    </div>
                </div>
                :
                <div className='w-full flex justify-between items-center text-[20px] mb-6 px-2 md:px-0'>
                    {!videos[0].title ?
                        <h2 className='text-center text-2xl md:text-5xl font-bold'>{upperFirstLetter(type) + 's'} : {nbrVideo}</h2>
                        :
                        <h2 className='text-center text-xl md:text-5xl font-bold'>{upperFirstLetter(type)} : {nbrVideo}</h2>
                    }
                    {valueMenu && <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} />}
                </div>
            }

            <Galery images={videos} type={type} />

            <NavPage page={page} numberPage={numberPage} />
        </div>
    )
}