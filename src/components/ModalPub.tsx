'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function ModalPub() {
    const [openSearchBar, setOpenSearchBar] = useState(true)
    const [randPub, setRandPub] = useState('https://candy.ai?via=hamelio73')

    // Fonction pour réinitialiser openSearchBar à true après 60 secondes
    const resetSearchBar = () => {
        setOpenSearchBar(true);
    };

    useEffect(() => {
        if (!openSearchBar) {
            // Définir un délai de 60 secondes pour réinitialiser openSearchBar à true
            const nbrMinutes = 5;
            const timeoutId = setTimeout(resetSearchBar, (nbrMinutes * 60000));

            // Nettoyer le timeout si le composant est démonté avant l'expiration du délai
            return () => clearTimeout(timeoutId);
        }
        else {
            const pub = ['https://candy.ai?via=hamelio73', 'https://chaturbate.com/in/?tour=LQps&campaign=WVA4P&track=default&room=hamelio']
            const rand = Math.floor(Math.random() * pub.length)
            console.log(rand)
            console.log(pub[rand])
            setRandPub(pub[rand])
        }
    }, [openSearchBar]);

    return (
        <Link href={randPub} role='link' aria-label={'Add new tab'} target="_blank" rel="noopener" onClick={() => setOpenSearchBar(false)} data-modal-backdrop="static" aria-hidden="true" className={`${openSearchBar ? "flex" : "hidden"}
        fixed top-0 right-0 left-0 justify-center items-center md:inset-0 
        w-full h-full bg-tranparent z-[98] overflow-hidden`} >
        </Link>
    )
}