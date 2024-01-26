import React from 'react'
import Test from './test';
import { upperFirstLetter } from '@/components/Utils';


export async function generateMetadata({
    params,
}: {
    params: {
        test: string;
    };
}) {
    try {
        if (false) {
            return {
                title: "Not Found",
                description: "The page you are looking for does not exist.",
            }
        }
        return {
            title: upperFirstLetter(params.test) + 's',
            description: 'All ' + params.test + 's in Perfectporn'
        }

    } catch (error) {
        console.log(error);
        return {
            title: "Not Found",
            description: "The page you are looking for does not exist.",
        };
    }
}

export default function Page({ params, searchParams, }: {
    params: { test: string; }
    searchParams: { page: number }
}) {

    return (
        <Test test={params.test} page={searchParams.page} />
    )
}