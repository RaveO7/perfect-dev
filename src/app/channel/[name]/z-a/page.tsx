import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function ChannelZAPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="channel" categoryName={categoryName} order="Z->A" title="Z->A" showFilter={true} />
}

