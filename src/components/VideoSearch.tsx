import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { formatString } from './Utils'

export default function VideoPresentationSearch({ title, photo, type, keyId }: any) {
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

    return (
        <Link href={'/' + type + '/' + title}
            title={type + ' ' + title}
            role='link'
            aria-label={'Go to ' + type + ' name ' + title}
            className="group p-1 md:p-2 w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap">
            <div className='w-full'>
                {keyId <= 7 ?
                    <Image
                        className="relative aspect-video overflow-hidden rounded-xl block h-full w-full  object-cover object-center
                                sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        alt={title + ' Image ' + type}
                        width={widthImg}
                        quality={80}
                        height='1'
                        decoding="async"
                        data-nimg="1"
                        src={photo}
                        priority={true}
                        rel='preload'
                        fetchPriority='high'
                    />
                    :
                    <Image
                        className="relative aspect-video overflow-hidden rounded-xl block h-full w-full  object-cover object-center
                            sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        alt={title + ' Image ' + type}
                        loading="lazy"
                        width={widthImg}
                        quality={80}
                        height='1'
                        decoding="async"
                        data-nimg="1"
                        src={photo}
                    />
                }
            </div>

            <h3 className="overflow-hidden  text-timeVideo group-hover:text-white text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words max-h-10">
                {formatString(title)}
            </h3>
        </Link>
    )
}