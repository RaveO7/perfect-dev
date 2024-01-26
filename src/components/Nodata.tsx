import Link from 'next/link'
import React from 'react'

export default function Nodata() {
    return (
        <div className='text-center text-5xl'>
            <p className='mb-5'>No data</p>
            <button className='
                m-auto
                rounded-lg p-5
                flex items-around items-center justify-center
                overflow-hidden
                text-white bg-pink-700 dark:bg-pink-600 border-transparent
                hover:bg-pink-800 dark:hover:bg-pink-700
                active:text-white active:border-white
                focus:ring-4  focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800
                duration-300'>
                <Link href={'/'}>Return to Home</Link>
            </button>
        </div>
    )
}