'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function ModalPub() {
    const [openSearchBar, setOpenSearchBar] = useState(true)



    // Fonction pour réinitialiser openSearchBar à true après 60 secondes
    const resetSearchBar = () => {
        setOpenSearchBar(true);
    };

    useEffect(() => {
        if (!openSearchBar) {
            // Définir un délai de 60 secondes pour réinitialiser openSearchBar à true
            const nbrMinutes = 4;
            const timeoutId = setTimeout(resetSearchBar, (nbrMinutes * 60000));

            // Nettoyer le timeout si le composant est démonté avant l'expiration du délai
            return () => clearTimeout(timeoutId);
        }
    }, [openSearchBar]);

    return (
        <Link href='http://localhost:3001/' role='link' aria-label={'Add new tab'} target="_blank" rel="noopener" onClick={() => setOpenSearchBar(false)} data-modal-backdrop="static" aria-hidden="true" className={`${openSearchBar ? "flex" : "hidden"}
        fixed top-0 right-0 left-0 justify-center items-center md:inset-0 
        w-full h-full bg-bgBody/90 backdrop-blur-md z-[98] overflow-hidden`} >
        </Link>
    )
}