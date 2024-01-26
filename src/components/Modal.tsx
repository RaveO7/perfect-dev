import React, { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { DroptownMenu } from './DroptownMenu'
import { RxCross2 } from "react-icons/rx";
import { useRouter } from 'next/navigation';

interface Props {
    openSearchBar: boolean
    setOpenSearchBar: Dispatch<SetStateAction<boolean>>
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    valueMenu: string
    setValueMenu: Dispatch<SetStateAction<string>>
}

export function Modal(props: Props) {
    const openSearchBar = props.openSearchBar
    const setOpenSearchBar = props.setOpenSearchBar
    const setSearch = props.setSearch
    const search = props.search
    const valueMenu = props.valueMenu
    const setValueMenu = props.setValueMenu
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function searchStart() { openSearchBar ? setOpenSearchBar(false) : setOpenSearchBar(true) }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        searchStart();
        setIsLoading(true)

        try {
            router.push("/search/" + valueMenu + "/" + search);
        } catch (error) {
            // Handle error if necessary
            console.error(error)
        } finally {
            setIsLoading(false) // Set loading to false when the request completes
        }
    }

    const keyDownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === "k" || event.key === "Escape" && openSearchBar) {
            event.preventDefault()
            searchStart()
        }
    };

    const inputRef: any = useRef(null);

    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);
        openSearchBar && inputRef.current.focus();
        document.documentElement.style.overflow = openSearchBar ? 'hidden' : 'auto'; //Close scroolBar
        return () => { window.removeEventListener("keydown", keyDownHandler); };
    }, [keyDownHandler]);

    const ref = useRef(null);

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const elementPrincipale: any = ref.current
            if (!elementPrincipale.contains(event.target)) {
                setOpenSearchBar(false)
            }
        };

        window.addEventListener("mousedown", handleOutSideClick);
        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [ref]);

    return (
        <div data-modal-backdrop="static" aria-hidden="true" className={`${openSearchBar ? "flex" : "hidden"}
        fixed top-0 right-0 left-0 justify-center items-center md:inset-0 
        w-full h-full bg-bgBody/90 backdrop-blur-md z-50 overflow-hidden`} >
            <div className="p-4 md:p-0">
                <form ref={ref} onSubmit={onSubmit}
                    className='p-4 md:p-5 md:min-w-[650px] h-auto max-w-2xl w-full relative bg-gray-700 dark:bg-gray-700 rounded-lg shadow'>

                    <div className='flex justify-end mb-3 absolute right-1 top-1'>
                        <button type="button" data-modal-hide="static-modal" onClick={searchStart}
                            className="
                        w-8 h-8 text-sm rounded-lg
                        inline-flex justify-center items-center
                        text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white" >
                            <RxCross2 className="w-6 h-6" />

                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className='w-full flex items-center justify-between mt-8 mb-10 gap-3 '>

                        <div className='flex flex-row-reverse flex-1 gap-1'>
                            <input id="a" name='title' ref={inputRef} onChange={(e) => setSearch(e.target.value)} value={search} placeholder={"Search " + valueMenu + " ..."} type='text' dir="auto"
                                className=" w-full border-b text-lg  font-[700] leading-[23px] tracking-[0px] text 
                                placeholder:text-alt3 bg-transparent focus-visible:outline-none focus-visible:border-pink-500 dark:focus-visible:border-pink-500" />

                            <IoSearch id="b" className="w-6 h-6 text-white" />
                        </div>

                        <DroptownMenu valueMenu={valueMenu} setValueMenu={setValueMenu} />

                    </div>

                    <button type="button"
                        className="w-[95%] text block m-auto
                        focus:ring-4 focus:outline-none font-medium rounded-lg text-sm-center 
                        text-white bg-pink-600 hover:bg-pink-700 focus:ring-pink-300
                        dark:text-white dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800">
                        <input type='submit' name='submit' value="Valider" className='w-full py-3  hover:cursor-pointer' />
                    </button>

                </form>
            </div>
        </div>
    )
}