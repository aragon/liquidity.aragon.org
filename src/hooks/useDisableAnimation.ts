import { useCallback, useState } from 'react'

type DisableAnimationReturn = [boolean, () => void]

// Simple hook for performing Spring animations immediately
export function useDisableAnimation(): DisableAnimationReturn {
  const [animationDisabled, setAnimationDisabled] = useState(true)

  const enableAnimation = useCallback(() => {
    if (animationDisabled) {
      setAnimationDisabled(false)
    }
  }, [animationDisabled])

  return [animationDisabled, enableAnimation]
}
