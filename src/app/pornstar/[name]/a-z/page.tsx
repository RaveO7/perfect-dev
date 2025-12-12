import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function PornstarAZPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="pornstar" categoryName={categoryName} order="A->Z" title="A->Z" showFilter={true} />
}

