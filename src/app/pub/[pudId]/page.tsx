
import React from 'react'

import Image from 'next/image'
import ModalPub from '@/components/ModalPub'

function page() {

    const q = 25

    return (
        <>
            <div className='w-full h-screen bg-pink-500 flex flex-wrap absolute top-0 z-[100]'>
                <ModalPub />
                <div className='bg-blue-500 w-1/2 h-1/2'>
                    <Image
                        className="block h-full w-full object-cover object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        alt="t"
                        loading="lazy"
                        width='400'
                        quality={q * 2}
                        height='1'
                        decoding="async"
                        data-nimg="1"
                        priority={false}
                        src='https://hdporn92.com/wp-content/uploads/2024/01/DadCrush-Sydney-Paige-Reyna-Belle-Three-Can-Work-It-Out-_-01.16.2024.jpg'
                    />
                </div>
                <div className='bg-green-500 w-1/2 h-1/2'>
                    <Image
                        className="block h-full w-full object-cover object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        alt="t"
                        loading="lazy"
                        width='400'
                        quality={q * 3}
                        height='1'
                        decoding="async"
                        data-nimg="1"
                        priority={false}
                        src='https://hdporn92.com/wp-content/uploads/2024/01/DadCrush-Sydney-Paige-Reyna-Belle-Three-Can-Work-It-Out-_-01.16.2024.jpg'
                    />
                </div>
                <div className='bg-yellow-500 w-1/2 h-1/2'>
                    <Image
                        className="block h-full w-full object-cover object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        alt="t"
                        loading="lazy"
                        width='400'
                        quality={q * 4}
                        height='1'
                        decoding="async"
                        data-nimg="1"
                        priority={false}
                        src='https://hdporn92.com/wp-content/uploads/2024/01/DadCrush-Sydney-Paige-Reyna-Belle-Three-Can-Work-It-Out-_-01.16.2024.jpg'
                    />
                </div>
            </div>
        </>
    )
}

export default page