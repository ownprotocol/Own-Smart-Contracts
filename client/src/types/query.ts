export type QueryHook<T> =
  | { isLoading: true }
  | { isLoading: false; data: T; refetch: () => Promise<void> };
