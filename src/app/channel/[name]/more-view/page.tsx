import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function ChannelMoreViewPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="channel" categoryName={categoryName} order="More View" title="More View" />
}

