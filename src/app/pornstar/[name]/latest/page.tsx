import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function PornstarLatestPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="pornstar" categoryName={categoryName} order="Latest" title="Latest" />
}

