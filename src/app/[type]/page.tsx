import InfiniteCategoryList from '@/components/InfiniteCategoryList'

export default function CategoryListPage({ params }: { params: { type: string; } }) {
    const { type } = params
    const tableau = ["channels", "pornstars", "categories"]
    const categoryType = tableau.includes(type) ? type : tableau[0]

    return (
        <InfiniteCategoryList
            categoryType={categoryType}
            order="A->Z"
            title="A->Z"
            showFilter={true}
        />
    )
}