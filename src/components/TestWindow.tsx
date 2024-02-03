import React from 'react'
import BurgerMenuIndexPage from './DroptwonFilter'
import VideoPresentationSearch from './VideoSearch'
import { formatString, upperFirstLetter } from './Utils'
import NavPage from './NavPage'
import Loading from './Loading'
import Nodata from './Nodata'
import VideoPresentationTest from './VideoPresentationTest'
import { VariableSizeGrid as Grid } from 'react-window'
import { FixedSizeGrid as GridFixed } from 'react-window'
import { FixedSizeList as List } from 'react-window'
import Link from 'next/link'
import AutoSizer from 'react-virtualized-auto-sizer';

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

export default function TestWindow(props: Props) {
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



    const columnWidths = new Array(1000)
        .fill(true)
        .map(() => 75 + Math.round(Math.random() * 50));
    const rowHeights = new Array(1000)
        .fill(true)
        .map(() => 25 + Math.round(Math.random() * 50));



    const Example = () => (
        <GridFixed
            className='w-[100%] h-screen bg-red-500'
            style={{ width: 'full', height: "full" }}
            columnCount={4}
            columnWidth={380}
            width={300}
            height={150}
            rowCount={48 / 4}
            rowHeight={50}
        >
            {Cell}
        </GridFixed>
    );

    const Cell = ({ columnIndex, rowIndex, style }: any) => (
        <div className='group p-1 md:p-2  w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap overflow-hidden'>
            <Link href="" className="text-white hover:text-white">
                <div className='w-full relative aspect-video overflow-hidden rounded-xl block'>
                    <div className='bg-blue-500 block w-[338px] h-full  sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105'>
                        Item {rowIndex + 1},{columnIndex + 1}
                    </div>
                </div>
            </Link>
        </div>
    );


    return (
        <div className='flex flex-col w-full'>
            <div className='mx-6 flex flex-col justify-between items-center text-[20px]'>
                <div className='w-full flex justify-between items-center text-[20px] mb-6'>
                    <h2>{valueMenu + " " + upperFirstLetter("videos")}</h2>
                    <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} />
                </div>
            </div>
            {Example()}
            <div className="w-full flex flex-wrap mb-3">
                {videos.map((video: any, id: number) =>
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
                )}
            </div>
        </div>
    )
}