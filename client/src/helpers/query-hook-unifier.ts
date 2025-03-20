// eslint-disable @typescript-eslint/no-explicit-any

/// This method consumes multiple query hooks and returns a single object with a single isLoading state

import { QueryHook } from "@/types/query";

/// This significantly improves usage of multiple hooks in a single component
export const queryHookUnifier = <T extends Record<string, QueryHook<any>>>(
  hooks: T,
):
  | { isLoading: true }
  | {
      isLoading: false;
      data: {
        [K in keyof T]: Extract<T[K], { isLoading: false }>["data"];
      };
    } => {
  // Check if any hook is loading
  const isAnyLoading = Object.values(hooks).some(
    (hook) => hook.isLoading === true,
  );

  // If any hook is loading, return loading state
  if (isAnyLoading) {
    return { isLoading: true };
  }

  // Since we know no hooks are loading, we can safely extract the data
  const data = {} as {
    [K in keyof T]: T[K] extends { isLoading: false; data: infer U }
      ? U
      : never;
  };

  // Explicitly cast each property to help TypeScript understand the type
  for (const key in hooks) {
    if (Object.prototype.hasOwnProperty.call(hooks, key)) {
      const hook = hooks[key] as { isLoading: false; data: any };
      data[key] = hook.data;
    }
  }

  return {
    isLoading: false,
    data,
  };
};
