'use client'
import React, { useState } from 'react'
import AdBlockChecker from "@/components/AdBlockChecker";

export default function AdBlock() {
  const [isBlocked, setIsBlocked] = useState<boolean>();
  const fetchData = async () => {
    const blocked = await AdBlockChecker();
    setIsBlocked(blocked)
  };

  fetchData();

  if (isBlocked) {
    return (
      <div data-modal-backdrop="static" aria-hidden="true" className={`
        fixed top-0 right-0 left-0 bottom-0 justify-center items-center md:inset-0 
        w-full h-full  bg-bgBody/90 backdrop-blur-md z-[99] overflow-hidden`} >
        <div className="p-1 h-screen m-auto flex justify-center items-center">
          <div
            className='p-4 md:p-5 md:min-w-[650px] w-full h-auto max-w-2xl 
            relative 
            rounded-lg shadow
            border-2 border-red-900 dark:border-red-900 '>
            <div className='w-full flex flex-col items-center justify-between mb-4 gap-3'>
              <h2 className='text-4xl md:text-6xl'>Perfect<span className='text-pink-300'>Porn</span></h2>
              <h3 className='text-xl md:text-2xl underline-offset-4 underline text-center'>Please Desacive AdBlock for acces of <br /> <b>Free</b> Porn Videos</h3>
              <h3 className='md:max-w-[80%]'>
                <div className='my-2'>
                  We understand that ads can be annoying however our site depends on advertising to continue to provide you with quality content.
                </div>
                <div className='mb-2'>
                  If you have an ad blocker, please disable it on this site to help us.
                </div>
                <div className='mb-2'>
                  Don't worry, our ads don't contain any annoying content and won't disturb your viewing experience.
                </div>
              </h3>
            </div>
            <button type="button"
              name='Age verification button'
              onClick={() => window.location.reload()}
              className="w-[95%] text block m-auto text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
              <input type='submit' name='submit' value="Refresh Page" className='w-full py-3  hover:cursor-pointer' />
            </button>
          </div>
        </div>
      </div>
    )
  }
}