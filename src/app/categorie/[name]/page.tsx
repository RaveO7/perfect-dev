import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function CategoriePage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="categorie" categoryName={categoryName} order="Latest" title="Latest" showFilter={true} />
}

