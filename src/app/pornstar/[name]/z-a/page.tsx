import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function PornstarZAPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="pornstar" categoryName={categoryName} order="Z->A" title="Z->A" />
}

