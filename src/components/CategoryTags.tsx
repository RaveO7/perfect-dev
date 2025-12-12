import React from 'react'
import Link from 'next/link'
import { formatString } from './Utils'

interface CategoryTagsProps {
  categories: Array<{ name: string; imgUrl: string; nbr: number }>
}

export default function CategoryTags({ categories }: CategoryTagsProps) {
  if (!categories || categories.length === 0) return null

  return (
    <div className='w-full mb-6 px-4 lg:px-0'>
      <h3 className='text-dessous text-[15px] mb-[5px] font-semibold'>Popular Categories</h3>
      <div className='flex flex-wrap gap-2'>
        {categories.map((category, id) => (
          category && category.name && (
            <Link 
              href={`/categorie/${encodeURIComponent(category.name)}`} 
              key={id} 
              className='bg-bgTimeVideo hover:bg-midnight text-dessous rounded-lg text-sm py-2 px-[18px] inline-block transition-colors duration-200'
            >
              {formatString(category.name)}
            </Link>
          )
        ))}
      </div>
    </div>
  )
}

