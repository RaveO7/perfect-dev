import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { X, Menu } from 'lucide-react';
import Image from 'next/image';
import CoffeeImgMin from '@/app/assets/images/coffeeMin.webp'
export default function BurgerMenu() {
    const [burgerMenu, setBurgerMenu] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const elementPrincipale: any = ref.current
            if (!elementPrincipale.contains(event.target)) { setBurgerMenu(false) }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => { window.removeEventListener("mousedown", handleOutSideClick); };
    }, [ref]);

    const classLink = 'whitespace-nowrap rounded flex h-8 w-full items-center p-2 hover:bg-[#292c33] dark:hover:bg-[#292c33]'
    return (
        <div ref={ref} className='relative flex flex-col'>
            <button aria-label='Burger Menu Research' type="button"
                className="relative flex items-center justify-center w-10 h-10 rounded-full
                bg-gray-700 dark:bg-gray-700
                hover:bg-gray-600 dark:hover:bg-gray-600"
                onClick={() => setBurgerMenu((val) => !val)}>
                <X className={`absolute w-6 h-6 transition-all duration-300 ease-out
                ${burgerMenu ? 'rotate-180 opacity-100' : '-rotate-45 opacity-0 '}`} />
                <Menu className={`absolute w-6 h-6 transition-all duration-300 ease-out 
                ${burgerMenu ? 'rotate-45 opacity-0' : '-rotate-180 opacity-100'}`} />
            </button>

            <div className={`
                ${burgerMenu ? 'flex' : 'hidden'}
                shadow-[0px_4px_6px_#0f131a99,0px_2px_22px_#FFFFF0f]
                bg-[#1b1f24] dark:bg-[#1b1f24]
                text-[#f5f5f5 dark:text-[#f5f5f5
                border-[#292C33] dark:border-[#292C33]
                absolute -right-2 top-12 origin-bottom-right flex-col rounded-2xl border bg-alt shadow-bellowMedium `}>
                <div className=' flex flex-col justify-between z-20 items-center space-y-1px p-[7px]'>
                    <Link onClick={() => setBurgerMenu(false)} href={"/channel"} className={classLink}>Channels</Link>
                    <Link onClick={() => setBurgerMenu(false)} href={"/pornstar"} className={classLink}>Pornstars</Link>
                    <Link onClick={() => setBurgerMenu(false)} href={"/categorie"} className={classLink}>Categories</Link>
                    {/* <Link onClick={() => setBurgerMenu(false)} href={"/videos/" + Math.floor(Math.random() * 74) + 1} className={classLink}>Random Video</Link> */}
                </div>
                <div className='hd:hidden flex flex-row justify-between  space-x-2 items-center border-t border-[#292C33] p-2'>
                    <Link href="https://www.buymeacoffee.com/perfectporn" target="_blank" className='w-full flex justify-center'>
                        <Image width={40} height={40} className='w-10 h-10' src={CoffeeImgMin} alt='Buy me a coffee for help the developer' loading='lazy' />
                    </Link>
                </div>
            </div>
        </div>
    )
}