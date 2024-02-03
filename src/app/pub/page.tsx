'use client'
import TestWindow from '@/components/TestWindow';
import VirtualGrid from '@/components/VirtualGrid';
import React, { useState, useEffect } from 'react'
import { VariableSizeGrid as Grid } from 'react-window'


export default function Home({ searchParams, }: { searchParams: { page: number } }) {
    const [valueMenu, setValueMenu] = useState("Latest");
    const [videos, setDatasVideos] = useState([])
    const [nbrPage, setNbrPage] = useState(1)
    const [loading, setLoading] = useState(true)

    const pageNbr: number = searchParams.page && !isNaN(searchParams.page) ? Math.abs(searchParams.page) : 1

    useEffect(() => {
        async function getVideos() {
            try {
                setLoading(true)
                const apiUrlEndpoint = "/api/homeVideos"
                const postData: any = {
                    method: "POST",
                    header: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pageNbr: pageNbr,
                        order: valueMenu,
                    })
                }

                const response = await fetch(apiUrlEndpoint, postData)
                const res = await response.json()

                await setNbrPage(Math.ceil(res[0].nbr / 48))
                await setDatasVideos(res)
                setLoading(false)
            }
            catch {
                setLoading(false)
                return;
            }
        }

        getVideos();

    }, [pageNbr, valueMenu])

    // These item sizes are arbitrary.
    // Yours should be based on the content of the item.
    const columnWidths = new Array(1000)
        .fill(true)
        .map(() => 75 + Math.round(Math.random() * 50));
    const rowHeights = new Array(1000)
        .fill(true)
        .map(() => 25 + Math.round(Math.random() * 50));

    const Cell = ({ columnIndex, rowIndex, style }: any) => (
        <div style={style}>
            Item {rowIndex},{columnIndex}
        </div>
    );


    const Example = () => (
        <Grid
            columnCount={1000}
            columnWidth={index => columnWidths[index]}
            height={150}
            rowCount={1000}
            rowHeight={index => rowHeights[index]}
            width={300}
        >
            {Cell}
        </Grid>
    );


    return (
        <VirtualGrid data={videos} />

    )
}