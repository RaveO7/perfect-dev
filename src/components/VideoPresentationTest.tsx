import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { IoMdThumbsUp } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";

export default function VideoPresentationTest({ video, type, keyId }: any) {
    const [widthImg, setWidthImg] = useState(300);
    const id: string = video.id
    const title: string = video.title
    const url: string = video.imgUrl
    const time: number = video.time
    const like: number = video.like
    const dislike: number = video.dislike
    const view: number = video.view

    const updateScreenSize = () => {
        if (window.innerWidth <= 540) { setWidthImg(100) }
        else { setWidthImg(300) }
    };

    useEffect(() => {
        // Mettez à jour la taille de l'écran au chargement de la page
        updateScreenSize();

        // Ajoutez un écouteur d'événements pour détecter les changements de taille de l'écran
        window.addEventListener('resize', updateScreenSize);

        // Retirez l'écouteur d'événements lors du démontage du composant
        return () => { window.removeEventListener('resize', updateScreenSize); };
    }, []); // Le tableau vide en tant que deuxième argument signifie que cet effet ne s'exécute qu'une fois lors du montage

    const rating = ((100 * like) / (like + dislike)) ? (100 * like) / (like + dislike) : 0;
    const classDiv = type == "video" ? "group p-1 md:p-2 w-1/3 flex flex-wrap overflow-hidden" : "group p-1 md:p-2 w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap overflow-hidden"
    return (
        // <div className={classDiv}>
        <div className="group p-1 md:p-2 w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap bg-green-500 border-2 overflow-hidden">
            <Link
                href={'/videos/' + id + "?name=" + title} title={title}
                role='link'
                aria-label={'Go to video ' + title}
                className='text-timeVideo hover:text-white'>
                <div className='w-full relative block aspect-video overflow-hidden rounded-xl  bg-red-500'>
                    {keyId <= 7 ?
                        // <Image
                        //     className="block max-w-full max-h-full w-auto h-auto  object-cover sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        //     alt={title}
                        //     style={{ width: 'auto', height: 'auto' }}
                        //     width={widthImg}
                        //     height='1'
                        //     quality={80}
                        //     decoding="async"
                        //     data-nimg="1"
                        //     src={url}
                        //     priority={true}
                        //     rel='preload'
                        //     fetchPriority='high'
                        //     loading='eager'
                        // />
                        <div className='bg-blue-500 w-full h-full object-cover'></div>
                        :
                        <Image
                            className="
                            block max-w-full max-h-full w-auto h-auto  object-cover 
                            sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                            alt={title}
                            style={{ width: 'auto', height: 'auto' }}
                            loading="lazy"
                            width={widthImg}
                            quality={80}
                            height='1'
                            decoding="async"
                            data-nimg="1"
                            src={url}
                        />
                    }
                    {time != 0 &&
                        <div className="tracking-wider	text-xs px-[4px] absolute rounded right-[6px] top-[6px] w-auto h-auto bg-bgTimeVideo opacity-80 text-timeVideo hover:text-white">
                            <p>{time}</p>
                        </div>
                    }
                    <div className=" text-xs absolute right-[6px] bottom-[6px] rounded w-auto h-auto px-1 bg-bgTimeVideo opacity-80 text-timeVideo hover:text-white">
                        <div className="flex items-center ">
                            <IoEyeSharp className="mr-[2px] text-grey-500" />
                            <p className="mr-2 hover:cursor-auto">{view}</p>
                            <IoMdThumbsUp className="mr-[2px] text-grey-500" />
                            <p className="hover:cursor-auto">{rating}%</p>
                        </div>
                    </div>
                </div>
                <div className='overflow-hidden bg-pink-500'>
                    <h3 className="text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words max-h-10">
                        {title}
                    </h3>
                </div>
            </Link >
        </div >
    )
}