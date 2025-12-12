import InfiniteCategoryVideoList from '@/components/InfiniteCategoryVideoList'

export default function CategorieMoreViewPage({ params }: { params: { name: string } }) {
  const categoryName = decodeURIComponent(params.name)
  return <InfiniteCategoryVideoList categoryType="categorie" categoryName={categoryName} order="More View" title="More View" />
}

