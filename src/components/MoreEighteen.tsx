// components/AgeVerificationModal.js
'use client'
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from './Utils';

const MoreEighteen = () => {
  const [morenMoreEighteen, setMorenMoreEighteen] = useState(false);

  useEffect(() => { if (!getCookie('moreEighteen')) { setMorenMoreEighteen(true); } }, []);

  const handleModalClick = () => {
    setMorenMoreEighteen(false);
    setCookie('moreEighteen', 'true', 0.2, '/')
  };

  return (
    morenMoreEighteen && (
      <div data-modal-backdrop="static" aria-hidden="true" className={`
      fixed top-0 right-0 left-0 bottom-0 justify-center items-center md:inset-0 
      w-full h-full  bg-bgBody/90 backdrop-blur-md z-[100] overflow-hidden`} >
        <div className="p-4 md:p-0 h-screen m-auto flex justify-center items-center">
          <div
            className='p-4 md:p-5 md:min-w-[650px] h-auto max-w-2xl w-full relative bg-gray-700 dark:bg-gray-700 rounded-lg shadow'>
            <div className='w-full flex flex-col items-center justify-between mb-4 gap-3'>
              <h2 className='text-4xl md:text-6xl'>Perfect<span className='text-pink-300'>Porn</span></h2>
              <h3 className='text-xl md:text-2xl'>Are you 18?</h3>
              <h3 className='max-w-[80%]' rel='preload'>
                PerfectPorn is an adult-only community.
                You must be 18 years of age or older to enter this site.
              </h3>
            </div>
            <button type="button"
              name='Age verification button'
              onClick={handleModalClick}
              className="w-[95%] text block m-auto text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm-center bg-pink-600 hover:bg-pink-700 focus:ring-pink-800 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
              <input type='submit' name='submit' value="I am 18 or older - Enter" className='w-full py-3  hover:cursor-pointer' />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default MoreEighteen;
