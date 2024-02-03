import React, { useEffect, useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { upperFirstLetter } from './Utils';

import { IoMdThumbsUp } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";

export default function VideoPresentationTest({ id, type, title, url, channels, time, view, like, dislike, keyId }: any) {
    const [widthImg, setWidthImg] = useState(300);

    const updateScreenSize = () => {
        if (window.innerWidth <= 766) { setWidthImg(100) }
        else { setWidthImg(300) }
    };

    useEffect(() => {
        // Mettez à jour la taille de l'écran au chargement de la page
        updateScreenSize();


        // Ajoutez un écouteur d'événements pour détecter les changements de taille de l'écran
        window.addEventListener('resize', updateScreenSize);

        // Retirez l'écouteur d'événements lors du démontage du composant
        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []); // Le tableau vide en tant que deuxième argument signifie que cet effet ne s'exécute qu'une fois lors du montage

    const channel = channels == undefined ? "" : upperFirstLetter(channels.replace(/,.*$/, ''))
    const rating = ((100 * like) / (like + dislike)) ? (100 * like) / (like + dislike) : 0;

    const classDiv = type == "video" ? "group p-1 md:p-2 w-1/3 flex flex-wrap overflow-hidden" : "group p-1 md:p-2  w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap overflow-hidden"
    return (
        <div className={classDiv}>
            <Link
                href={'/videos/' + id + "?name=" + title} title={title}
                role='link'
                aria-label={'Go to video ' + title}
                className='text-timeVideo hover:text-white'>
                <div className='w-full relative aspect-video overflow-hidden rounded-xl block'>
                    {keyId <= 7 ?
                        <Image
                            className="block w-full h-full object-fill object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                            alt={title}
                            width={widthImg}
                            height='1'
                            quality={80}
                            decoding="async"
                            data-nimg="1"
                            src={url}
                            priority={true}
                            rel='preload'
                            fetchPriority='high'
                        />
                        :
                        <Image
                            className="block w-full h-full object-fill object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                            alt={title}
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
                <div className='overflow-hidden'>
                    <h3 className=" text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words max-h-10">
                        {title}
                    </h3>
                </div>
            </Link >
        </div >
    )
}