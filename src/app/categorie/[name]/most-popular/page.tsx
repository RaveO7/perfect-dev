import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function CategorieMostPopularPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="categorie" categoryName={categoryName} order="Most Popular" title="Most Popular" showFilter={true} />
}

