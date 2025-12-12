import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function CategorieZAPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="categorie" categoryName={categoryName} order="Z->A" title="Z->A" />
}

