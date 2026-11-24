'use client';

import { useCallback, useRef, useState } from 'react';
import { loadMoreBuildsAction } from '@/modules/builds/actions';
import type { CursorPage, FeedBuildItem } from '@/types/domain';

export interface UseInfiniteBuildsOptions {
  initialPage: CursorPage<FeedBuildItem>;
  kind?: 'all' | 'project' | 'paper';
  domain?: string;
  search?: string;
  tech?: string;
  onlyMineForUserId?: string;
  limit?: number;
}

export interface UseInfiniteBuildsResult {
  items: FeedBuildItem[];
  hasMore: boolean;
  loadingMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  resetWithPage: (page: CursorPage<FeedBuildItem>) => void;
  prependItem: (item: FeedBuildItem) => void;
  updateItem: {
    (updated: FeedBuildItem): void;
    (id: string, updater: (prev: FeedBuildItem) => FeedBuildItem): void;
  };
}

/**
 * Client-side infinite cursor pagination hook backed by `loadMoreBuildsAction`.
 */
export function useInfiniteBuilds({
  initialPage,
  kind = 'all',
  domain,
  search,
  tech,
  onlyMineForUserId,
  limit = 18,
}: UseInfiniteBuildsOptions): UseInfiniteBuildsResult {
  const [prevInitialPage, setPrevInitialPage] =
    useState<CursorPage<FeedBuildItem>>(initialPage);
  const [items, setItems] = useState<FeedBuildItem[]>(initialPage.items);
  const [cursor, setCursor] = useState<string | null>(initialPage.nextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialPage.hasMore);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  if (prevInitialPage !== initialPage) {
    setPrevInitialPage(initialPage);
    setItems(initialPage.items);
    setCursor(initialPage.nextCursor);
    setHasMore(initialPage.hasMore);
    setError(null);
    setLoadingMore(false);
  }

  const resetWithPage = useCallback((page: CursorPage<FeedBuildItem>) => {
    setPrevInitialPage(page);
    setItems(page.items);
    setCursor(page.nextCursor);
    setHasMore(page.hasMore);
    setError(null);
    loadingRef.current = false;
    setLoadingMore(false);
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || !cursor) {
      return;
    }

    loadingRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const result = await loadMoreBuildsAction({
        kind,
        domain,
        search,
        tech,
        onlyMineForUserId,
        cursor,
        limit,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const nextPage = result.data;
      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const fresh = nextPage.items.filter((item) => !seen.has(item.id));
        return [...prev, ...fresh];
      });
      setCursor(nextPage.nextCursor);
      setHasMore(nextPage.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load more builds.'
      );
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [cursor, domain, hasMore, kind, limit, onlyMineForUserId, search, tech]);

  const prependItem = useCallback((item: FeedBuildItem) => {
    setItems((prev) => [
      item,
      ...prev.filter((existing) => existing.id !== item.id),
    ]);
  }, []);

  const updateItem = useCallback(
    (
      idOrItem: string | FeedBuildItem,
      updater?: (prev: FeedBuildItem) => FeedBuildItem
    ) => {
      if (typeof idOrItem === 'string') {
        if (!updater) return;
        setItems((prev) =>
          prev.map((item) => (item.id === idOrItem ? updater(item) : item))
        );
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === idOrItem.id ? idOrItem : item))
        );
      }
    },
    []
  );

  return {
    items,
    hasMore,
    loadingMore,
    error,
    loadMore,
    resetWithPage,
    prependItem,
    updateItem,
  };
}
