'use client'

import React, { useEffect } from 'react'

export default function PageDontLeave() {
    // effet pour déclencher l'envoi lorsque la page est fermée ou changée
    useEffect(() => {
        // fonction à exécuter avant de changer de page
        const handleBeforeUnload = () => { sendVideoInfoToDatabase('leavePage'); };

        // ajoutez un gestionnaire d'événement pour détecter la fermeture de la page
        window.addEventListener('beforeunload', handleBeforeUnload);

        // nettoyez les gestionnaires d'événements lors du démontage du composant
        return () => { window.removeEventListener('beforeunload', handleBeforeUnload); };
    }, []);
    async function sendVideoInfoToDatabase(action: any) {
        try {
            const apiUrlEndpoint = "/api/test"
            const postData: any = {
                method: "POST",
                header: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    test: action,
                })
            }
            await fetch(apiUrlEndpoint, postData)
        }
        catch {
            return;
        }
    }
    return (<></>)
}
