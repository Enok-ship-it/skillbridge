import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Keeps a new route from inheriting the previous page's scroll position. */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
