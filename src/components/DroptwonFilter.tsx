"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
    valueMenu: string
    setValueMenu: Dispatch<SetStateAction<string>>
    list: Array<string>
    categoryType?: string // Type de catégorie si on est sur une page de catégorie
}

// Fonction pour mapper les noms de filtres aux URLs
function getFilterUrl(filterName: string, pathname?: string, categoryType?: string): string {
    if (!pathname) {
        // Pages de vidéos normales
        const urlMap: { [key: string]: string } = {
            "Latest": "/latest",
            "More View": "/more-view",
            "Most Popular": "/most-popular",
            "A->Z": "/a-z",
            "Z->A": "/z-a"
        };
        return urlMap[filterName] || "/";
    }

    // Détecter si on est sur une page individuelle de catégorie (ex: /channel/ChannelName)
    const individualCategoryMatch = pathname.match(/\/(channel|pornstar|categorie)\/([^\/]+)/);
    if (individualCategoryMatch) {
        const type = individualCategoryMatch[1];
        const name = individualCategoryMatch[2];
        const basePath = `/${type}/${name}`;
        const urlMap: { [key: string]: string } = {
            "Latest": `${basePath}/latest`,
            "More View": `${basePath}/more-view`,
            "Most Popular": `${basePath}/most-popular`,
            "A->Z": `${basePath}/a-z`,
            "Z->A": `${basePath}/z-a`
        };
        return urlMap[filterName] || basePath;
    }

    // Si on est sur une page de liste de catégories (channels, pornstars, categories)
    if (categoryType) {
        const basePath = `/${categoryType}`;
        const urlMap: { [key: string]: string } = {
            "Latest": `${basePath}/latest`,
            "A->Z": `${basePath}/a-z`,
            "Z->A": `${basePath}/z-a`
        };
        return urlMap[filterName] || basePath;
    }
    
    // Sinon, pages de vidéos normales
    const urlMap: { [key: string]: string } = {
        "Latest": "/latest",
        "More View": "/more-view",
        "Most Popular": "/most-popular",
        "A->Z": "/a-z",
        "Z->A": "/z-a"
    };
    return urlMap[filterName] || "/";
}

export default function BurgerMenuIndexPage(props: Props) {
    const [burgerMenu, setBurgerMenu] = useState(false);
    const pathname = usePathname();

    const valueMenu = props.valueMenu
    const setValueMenu = props.setValueMenu
    const categoryType = props.categoryType
    
    // Détecter automatiquement le type de catégorie depuis l'URL si non fourni
    const detectedCategoryType = categoryType || (pathname?.match(/\/(channels|pornstars|categories)\//)?.[1])

    // ✅ OPTIMISÉ : Type explicite pour la ref
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // ✅ OPTIMISÉ : Type MouseEvent au lieu de any
        const handleOutSideClick = (event: MouseEvent) => {
            // ✅ OPTIMISÉ : Type explicite et vérification null
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setBurgerMenu(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, []); // ✅ OPTIMISÉ : ref est stable, pas besoin dans les dépendances

    const list = props.list.filter(list => list !== valueMenu);

    return (
        <div ref={ref} className='relative flex flex-col z-10 w-fit'>
            <button type="button" className="relative flex items-center justify-center h-10 w-full p-2 min-w-[110px] gap-3 rounded-xl hover:bg-gray-600 bg-gray-700 border-transparent border-2 hover:border-white"
                aria-label={'Button Open Burger Menu Choice Order Videos Actual Order Choice Is' + valueMenu}
                onClick={() => setBurgerMenu((val) => !val)}>
                <h3 className='text-sm md:text-xl'>{valueMenu}</h3>
                {burgerMenu ? (<IoCaretUpSharp />) : (<IoCaretDownSharp className="" />)}
            </button>

            {burgerMenu && (
                <div className="min-w-full
                absolute -right-1 top-12 flex origin-bottom-right flex-col rounded-2xl
                shadow-[0px_4px_6px_#0f131a99,0px_2px_22px_#FFFFF0f] bg-[#1b1f24] text-[#f5f5f5] border-x-2 border-y-[1px] border-[#292C33]">
                    <div className=' flex flex-col justify-between items-center space-y-1px p-[7px]'>
                        {list.map((name, id) => {
                            const filterUrl = getFilterUrl(name, pathname || undefined, detectedCategoryType);
                            return (
                                <Link 
                                    key={id} 
                                    aria-label={'Order By ' + name} 
                                    role='link' 
                                    href={filterUrl}
                                    onClick={() => setBurgerMenu(false)}
                                    className='whitespace-nowrap rounded flex h-8 w-full items-center p-2 hover:bg-[#292c33]'
                                >
                                    {name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}