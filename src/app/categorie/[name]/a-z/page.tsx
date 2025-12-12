import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function CategorieAZPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="categorie" categoryName={categoryName} order="A->Z" title="A->Z" />
}

