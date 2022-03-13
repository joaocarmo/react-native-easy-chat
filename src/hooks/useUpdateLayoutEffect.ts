import { useLayoutEffect, useMemo, useRef } from 'react'
import type { EffectCallback, DependencyList } from 'react'
import { error } from '../utils'

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * A custom useEffect hook that only triggers on updates, not on initial mount.
 *
 * @link https://stackoverflow.com/a/55075818/1526448
 * @param effect Imperative function that can return a cleanup function.
 * @param deps If present, effect will only activate if the values in the list change.
 */
export function useUpdateLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isInitialMount = useRef(true)
  const dependencies = useMemo(() => (Array.isArray(deps) ? deps : []), [deps])

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      if (typeof effect === 'function') {
        effect()
      } else {
        error(
          'useUpdateLayoutEffect must be passed a function as the first argument.',
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
