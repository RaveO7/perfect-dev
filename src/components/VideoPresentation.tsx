import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { IoMdThumbsUp } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { formatString, upperFirstLetter } from './Utils';

export default function
    VideoPresentation({ id, type, title, url, channels, time, view, like, dislike }: any) {
    const channel = channels == undefined ? "" : upperFirstLetter(channels.replace(/,.*$/, ''))
    const rating = ((100 * like) / (like + dislike)) ? (100 * like) / (like + dislike) : 0;

    const classDiv = type == "video" ? "group p-1 md:p-2 w-1/3 flex flex-wrap overflow-hidden" : "group p-1 md:p-2  w-1/2 md:w-1/3 xl:w-1/4 flex flex-wrap overflow-hidden"

    return (
        <div className={classDiv}>
            <Link
                href={'/videos/' + id + "?name=" + title} title={title}
                className='w-full relative aspect-video overflow-hidden rounded-xl block'
                role='link'
                aria-label={'Go to video ' + title}>
                <Image
                    className="block w-full h-full object-fill object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                    // object-cover
                    alt={title}
                    loading="lazy"
                    width='300'
                    quality={100}
                    height='1'
                    decoding="async"
                    data-nimg="1"
                    src={url}
                />
                {time != 0 &&
                    <div className="text-xs absolute right-[6px] bottom-[6px] w-[32px] h-[15px] bg-bgTimeVideo opacity-80 text-timeVideo hover:text-white">
                        <p>{time}</p>
                    </div>
                }
            </Link>

            <div className="flex justify-between text-sm text-infoVideo w-full">
                <Link href={'/chanelle/' + encodeURI(channel)}
                    title={channel}
                    role='link'
                    aria-label={'Go to channel ' + formatString(channel)} className="hover:text-white w-full text-ellipsis overflow-hidden max-h-5">{formatString(channel)}</Link>
                <div className="flex items-center">
                    <IoEyeSharp className="mr-[2px] text-grey-500" />
                    <p className="mr-2 hover:cursor-auto">{view}</p>
                    <IoMdThumbsUp className="mr-[2px] text-grey-500" />
                    <p className="hover:cursor-auto">{rating}%</p>
                </div>
            </div>

            <Link href={'/videos/' + id + "?name=" + title} role='link' aria-label={'Go to video ' + title} className='overflow-hidden'>
                <h3 className="text-timeVideo group-hover:text-white text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words h-10">
                    {/* max-h-10 */}
                    {title}
                </h3>
            </Link>
        </div>
    )
}