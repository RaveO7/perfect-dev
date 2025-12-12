import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function ChannelMostPopularPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="channel" categoryName={categoryName} order="Most Popular" title="Most Popular" />
}

