import { useCallback } from 'react'
// @ts-ignore
import { useToast } from '@aragon/ui'
import { writeText as copy } from 'clipboard-polyfill'

export function useCopyToClipboard(): (
  text: string,
  confirmationMessage?: string
) => void {
  const toast = useToast()
  return useCallback(
    (text, confirmationMessage = 'Copied') => {
      copy(text)
      if (confirmationMessage) {
        toast(confirmationMessage)
      }
    },
    [toast]
  )
}
