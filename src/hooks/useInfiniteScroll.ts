import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  threshold?: number // Distance en pixels avant la fin pour déclencher le chargement
}

export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 200
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)

  // Garder la référence à jour
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    const target = observerTarget.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMoreRef.current()
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.01
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loading, threshold])

  return observerTarget
}

