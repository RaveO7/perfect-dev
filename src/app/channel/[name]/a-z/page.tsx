import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function ChannelAZPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="channel" categoryName={categoryName} order="A->Z" title="A->Z" showFilter={true} />
}

