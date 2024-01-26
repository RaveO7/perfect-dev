"use client";

import Link from 'next/link'
import React, { useState } from 'react';
import Separateur from './Separateur'
import { IoSearch } from "react-icons/io5";
import { DroptownMenu } from './DroptownMenu';
import { Modal } from './Modal';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BurgerMenu from './BurgerMenu';

export default function Header() {
    const [openSearchBar, setOpenSearchBar] = useState(false);
    const [search, setSearch] = useState('');
    const [valueMenu, setValueMenu] = useState("videos");

    function searchStart() { openSearchBar ? setOpenSearchBar(false) : setOpenSearchBar(true) }

    return (
        <header className='w-full z-50 bg-midnight px-4 md:px-8 lg:px-12 py-4 fixed'>
            <HelmetProvider>
                <Helmet>
                    <script type="text/javascript" src="https://news-paxacu.com/code/https-v2.js?uid=176032&site=1219803064&banadu=0&sub1=sub1&sub2=sub2&sub3=sub3&sub4=sub4" async></script>
                    <script type="text/javascript" src="https://news-xekiyo.cc/process.js?id=1219803064&p1=sub1&p2=sub2&p3=sub3&p4=sub4" async></script>
                </Helmet>
            </HelmetProvider>

            <nav className="flex flex-row items-center justify-between m-auto w-full gap-5">

                {/* Left Part of Header */}
                <div className='flex gap-2'>
                    <Link href="/" className="flex items-center gap-2w-fit minsm:text-4xl text-2xl lg:text-2xl md:text-xl min-w-[155px] lg:min-w-[186px]">
                        <h1>Perfect<span className='text-pink-300'>Porn</span></h1>
                    </Link>
                </div>

                {/* Center Part of Header */}
                <div className='hidden md:flex'>
                    <div className='flex gap-4 items-center flex-1 max-w-[530px]'>
                        <div className='bg-gray-700 flex items-center justify-center max-w-[340px] rounded-full hover:bg-gray-600 hover:cursor-pointer' onClick={searchStart}>
                            <div className='hidden md:block md:w-[220px] lg:w-[340px]'>
                                <div className='flex h-10 flex-row items-center space-x-2 px-3'>
                                    <IoSearch id="b" className="w-5 h-5 text-white" />

                                    <div className="text-[14px] font-[600] leading-[18px] tracking-[0.1px] flex-grow text-alt2">{!search ? "Search " + valueMenu + " ..." : search} </div>

                                    <div className="text-[14px] font-[400] leading-[20px] tracking-[0] text-alt2">Ctrl+K</div>
                                </div>
                            </div>

                        </div>
                        by
                        <DroptownMenu valueMenu={valueMenu} setValueMenu={setValueMenu} />
                    </div>
                </div>

                <div className='hd:min-w-[210px] flex justify-end items-center gap-2 relative'>
                    {/* <button role='button' type='button' className='hd:inline hidden rounded-full bg-slate-50 text-gray-700 px-[18px] min-h-10 h-10 w-auto text-sm hover:bg-slate-200'>Sign Up</button> <button role='button' type='button' className='hd:inline hidden rounded-full bg-gray-700 text-slate-50 px-[18px] min-h-10 h-10 w-auto text-sm hover:bg-gray-600'>Log in</button> */}
                    <a href="https://www.buymeacoffee.com/perfectporn" target="_blank" className='hd:flex hidden  w-full  justify-center'>
                        <img className='h-10' src='https://cdn.buymeacoffee.com/buttons/v2/lato-yellow.png' alt='Buy me a coffee for help the developer' />
                    </a>
                    
                    <IoSearch id="b" className="md:hidden block hover:cursor-pointer hover:text-white w-6 h-6 md:w-5 md:h-5 text-gray-300 mr-1" onClick={searchStart} />

                    <div className='md:inline hidden'><Separateur /></div>

                    <BurgerMenu />
                </div>
                <Modal search={search} setOpenSearchBar={setOpenSearchBar} setSearch={setSearch} openSearchBar={openSearchBar} valueMenu={valueMenu} setValueMenu={setValueMenu} />
            </nav>
        </header >
    )
}