import Link from 'next/link'
import React from 'react'
import { upperFirstLetter } from './Utils'
import Image from 'next/image'

export default function VideoPresentationSearch({ title, photo, type }: any) {

    return (
        <Link href={'/' + type + '/' + title}
            title={type + ' ' + title}
            role='link'
            aria-label={'Go to ' + type + ' name ' + title}
            className="group p-1 md:p-2 w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap">
            <div className='w-full'>
                <Image
                    className="relative aspect-video overflow-hidden rounded-xl block h-full w-full  object-cover object-center
                                sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                    quality={100}
                    height='1'
                    decoding="async"
                    data-nimg="1"


                    alt={title + ' Image ' + type}
                    loading="lazy" width="400"
                    src={photo}
                />
            </div>

            <h3 className="overflow-hidden  text-timeVideo group-hover:text-white text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words max-h-10">
                {upperFirstLetter(title)}
            </h3>
        </Link>
    )
}