import React, { ReactNode, useEffect } from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { useLocation } from 'react-router-dom'
import AnimateEntrance from './AnimateEntrance/AnimateEntrance'

type MainViewProps = {
  children: ReactNode
}

const MainView = React.memo(function MainView({ children }: MainViewProps) {
  const { pathname } = useLocation()

  // Reset scroll position on route change
  useEffect(() => {
    document.getElementsByTagName('body')[0].scrollTo(0, 0)
  }, [pathname])

  return (
    <div
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        // Lock stacking context below modal
        z-index: 0;
      `}
    >
      <AnimateEntrance direction={-1}>
        <Header />
      </AnimateEntrance>

      <main
        css={`
          display: flex;
          flex-direction: column;
          flex: 1;
        `}
      >
        {children}
      </main>

      <AnimateEntrance>
        <Footer />
      </AnimateEntrance>
    </div>
  )
})

export default MainView
