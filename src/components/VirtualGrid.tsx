import { VariableSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const VirtualGrid = ({ data }: any) => {

    const [widthImg, setWidthImg] = useState(300);

    const updateScreenSize = () => {
        if (window.innerWidth <= 540) { setWidthImg(100) }
        else { setWidthImg(300) }
    };

    useEffect(() => {
        // Mettez à jour la taille de l'écran au chargement de la page
        updateScreenSize();

        // Ajoutez un écouteur d'événements pour détecter les changements de taille de l'écran
        window.addEventListener('resize', updateScreenSize);

        // Retirez l'écouteur d'événements lors du démontage du composant
        return () => { window.removeEventListener('resize', updateScreenSize); };
    }, []); // Le tableau vide en tant que deuxième argument signifie que cet effet ne s'exécute qu'une fois lors du montage

    const columnCount = 3; // Nombre de colonnes dans votre grille
    const columnWidth = 300; // Largeur d'une colonne

    const rowCount = Math.ceil(data.length / columnCount);
    const rowHeight = 200; // Hauteur d'une ligne
    console.log(data)
    const cellRenderer = ({ columnIndex, rowIndex, style }: any) => {
        const index = rowIndex * columnCount + columnIndex;

        if (index >= data.length) {
            return null;
        }

        const item = data[index];

        return (
            <Link
                href={'/videos/ ?name=' + item.title} title={item.title}
                role='link'
                aria-label={'Go to video ' + item.title}
                className='text-timeVideo hover:text-white'>
                <div className='w-full relative aspect-video overflow-hidden rounded-xl block'>
                    <Image
                        className="block w-full h-full object-fill object-center sm:transition-transform sm:duration-[400ms] sm:ease-in-out sm:group-hover:scale-105"
                        width={widthImg}
                        height='1'
                        quality={80}
                        decoding="async"
                        data-nimg="1"
                        src={item.imgUrl} alt={item.title}
                        priority={true}
                        rel='preload'
                        fetchPriority='high'
                        loading='eager'
                    />
                </div>
                <div className='overflow-hidden'>
                    <h3 className=" text-[16px] font-[600] leading-5 tracking-wide mt-1 break-words max-h-10">
                        {item.title}
                    </h3>
                </div>
            </Link >
        );
    };

    return (
        <div className='flex h-screen w-full bg-red-500'>
            <AutoSizer>
                {({ height, width }) => (
                    <Grid
                        width={width}
                        height={height}

                        columnCount={columnCount}
                        columnWidth={() => columnWidth}

                        rowCount={rowCount}
                        rowHeight={() => rowHeight}
                    >
                        {cellRenderer}
                    </Grid>
                )}
            </AutoSizer>
        </div>
    );
};

export default VirtualGrid;
