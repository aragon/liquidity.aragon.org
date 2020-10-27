import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  MutableRefObject,
} from 'react'
import useMeasure from 'react-use-measure'
import { ResizeObserver } from '@juggle/resize-observer'

type LayoutType = 'expanded' | 'collapsed'

interface StepperLayoutReturn {
  outerBoundsRef: (element: HTMLElement | SVGElement | null) => void
  innerBoundsRef: MutableRefObject<HTMLUListElement>
  layout: LayoutType
}

function useStepperLayout(): StepperLayoutReturn {
  const [outerBoundsRef, outerBounds] = useMeasure({
    polyfill: ResizeObserver,
  })
  const innerBoundsRef = useRef() as MutableRefObject<HTMLUListElement>
  const [innerBounds, setInnerBounds] = useState<number>(0)

  // First render must always be in "expanded" mode so that our measurement reference point is accurate
  const [layout, setLayout] = useState<LayoutType>('expanded')

  // It's important that we only query for the inner offsetWidth once so that our reference remains constant
  useLayoutEffect(() => {
    if (!innerBounds) {
      setInnerBounds(innerBoundsRef.current.offsetWidth)
    }
  }, [innerBounds, innerBoundsRef])

  useEffect(() => {
    const outerMeasured = outerBounds.width > 0

    if (outerMeasured && outerBounds.width < innerBounds) {
      setLayout('collapsed')
    }

    if (outerMeasured && outerBounds.width >= innerBounds) {
      setLayout('expanded')
    }
  }, [outerBounds, innerBounds])

  return { outerBoundsRef, innerBoundsRef, layout }
}

export default useStepperLayout
