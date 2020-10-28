import { useCallback, useEffect, useRef } from 'react'
// @ts-ignore
import { noop } from '@aragon/ui'

export function useInterval(
  callback: (clear: () => void) => void,
  delay: number
): void {
  const savedCallback = useRef<() => void>(noop)
  const intervalId = useRef<number>()

  const clear = useCallback(() => {
    clearInterval(intervalId.current)
  }, [])

  useEffect(() => {
    savedCallback.current = () => {
      callback(clear)
    }
  }, [callback, clear])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    // Avoid initial delys by running callback at starting edge
    tick()

    intervalId.current = setInterval(tick, delay)

    return () => {
      clear()
    }
  }, [callback, delay, clear])
}
