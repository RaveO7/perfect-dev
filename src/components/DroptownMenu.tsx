"use client"

import React, { useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';
import { upperFirstLetter } from './Utils';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5'

export function DroptownMenu({valueMenu, setValueMenu}: {valueMenu: string, setValueMenu: Dispatch<SetStateAction<string>>}) {
    const [openDropdownMenu, setOpenDropdownMenu] = useState(false);

    let list: Array<string> = [
        "videos",
        "channels",
        "pornstars",
        "categories",
    ];

    list = list.filter(list => list !== valueMenu);

    // ✅ OPTIMISÉ : Type React.MouseEvent au lieu de any
    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;
        setValueMenu(target.innerText.toLowerCase())
        setOpenDropdownMenu(false)
    };

    // ✅ OPTIMISÉ : Type explicite pour la ref
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // ✅ OPTIMISÉ : Type MouseEvent au lieu de any
        const handleOutSideClick = (event: MouseEvent) => {
            // ✅ OPTIMISÉ : Type explicite et vérification null
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpenDropdownMenu(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => { window.removeEventListener("mousedown", handleOutSideClick); };
    }, []); // ✅ OPTIMISÉ : ref est stable, pas besoin dans les dépendances

    return (
        <div className='w-[140px]' ref={ref}>
            <button data-modal-target="default-modal" data-modal-toggle="default-modal" type="button"
                className="w-full max-h-[24px] relative font-bold rounded-lg py-5 flex items-around items-center justify-center overflow-hidden duration-300 focus:ring-4 focus:outline-none border-transparent
                text-white dark:text-white
                bg-pink-800 dark:bg-pink-700
                hover:bg-pink-300 dark:hover:bg-pink-600
                active:text-white dark:active:text-white
                active:border-white dark:active:border-white
                focus:ring-pink-300 dark:focus:ring-pink-600"
                onClick={() => setOpenDropdownMenu((prev) => !prev)}>
                <div className='text-lg mr-4 '>{upperFirstLetter(valueMenu)}</div>
                {openDropdownMenu ? (<IoCaretUpSharp className="h-full absolute right-3" />) : (<IoCaretDownSharp className="h-full absolute right-3" />)}
            </button>

            {openDropdownMenu && (
                <div className={`bg-pink-400 dark:bg-pink-400 absolute overflow-hidden  flex flex-col items-start rounded-lg w-[140px]`}
                    onClick={(e) => handleClick(e)} >
                    {list.map((name) => (
                        <div className='p-1 flex w-full justify-between hover:bg-pink-300 dark:hover:bg-pink-300 cursor-pointer rounded-r-lg border-l-transparent' key={name}>
                            <h3 defaultValue="test">{upperFirstLetter(name)}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}