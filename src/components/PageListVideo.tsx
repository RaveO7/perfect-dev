import React, { Dispatch, SetStateAction } from 'react'
import Galery from './Galery'
import Loading from './Loading'
import Nodata from './Nodata'
import BurgerMenuIndexPage from './DroptwonFilter'
import { upperFirstLetter } from './Utils'


interface Props {
    valueMenu: string,
    setValueMenu: Dispatch<SetStateAction<string>>,
    videos: Array<any>,
    type: string,
    nbrVideo: number,
    loading: boolean,
    loadingMore?: boolean,
    hasMore?: boolean,
    scrollTarget?: React.RefObject<HTMLDivElement>,
    showFilter?: boolean, // Nouveau prop pour afficher/masquer le filtre
    categoryType?: string, // Type de catégorie pour le menu
    categoryName?: string, // Nom de la catégorie pour le menu
}

export default function PageListVideo(props: Props) {
    const { setValueMenu, videos, type, nbrVideo, loading, loadingMore = false, hasMore = false, scrollTarget, showFilter = true, categoryType, categoryName } = props;

    if (loading && videos.length === 0) return <Loading />
    if (!loading && videos.length === 0) return (<Nodata />)

    let list
    if (videos.length > 0 && !videos[0].title) { list = ["Latest", "A->Z", "Z->A",]; }
    else { list = ["Latest", "More View", "Most Popular", "A->Z", "Z->A",]; }

    const valueMenu = props.valueMenu ? list.includes(props.valueMenu) ? props.valueMenu : "Latest" : props.valueMenu
    // type, valueMenu, nbrVideo, setValueMenu, list
    return (
        <div className='flex flex-col w-full'>
            <div className='w-full flex justify-between items-center text-[20px] mb-6 px-4 lg:px-0 font-bold'>
                {!type ?
                    <h2 className='text-xl md:text-[27px]'>{valueMenu + " " + upperFirstLetter("videos")}</h2>
                    :
                    <h2 className='text-xl md:text-5xl'>{upperFirstLetter(type)} : {nbrVideo}</h2>
                }
                {valueMenu && showFilter && <BurgerMenuIndexPage valueMenu={valueMenu} setValueMenu={setValueMenu} list={list} categoryType={categoryType} />}
            </div>

            <Galery images={videos} type={type} />

            {/* Zone de détection pour le scroll infini */}
            {hasMore && (
                <div ref={scrollTarget} className="w-full h-32 flex items-center justify-center py-8">
                    {loadingMore && <Loading />}
                </div>
            )}
        </div >
    )
}
