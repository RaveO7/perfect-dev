import InfiniteCategoryList from '@/components/InfiniteCategoryList'

export default function ChannelsLatestPage() {
  return <InfiniteCategoryList categoryType="channels" order="Latest" title="Latest" showFilter={true} />
}

