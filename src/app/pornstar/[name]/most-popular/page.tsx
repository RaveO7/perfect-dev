import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function PornstarMostPopularPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="pornstar" categoryName={categoryName} order="Most Popular" title="Most Popular" showFilter={true} />
}

