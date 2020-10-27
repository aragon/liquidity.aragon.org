import React from 'react'

export default function useDetectMobileDevice(): boolean {
  return React.useMemo(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    return Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    )
  }, [])
}
