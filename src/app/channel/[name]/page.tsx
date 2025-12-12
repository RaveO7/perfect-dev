import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function ChannelPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="channel" categoryName={categoryName} order="Latest" title="Latest" showFilter={true} />
}

