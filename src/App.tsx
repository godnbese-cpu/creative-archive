import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import Home from '@/pages/Home'
import Works from '@/pages/Works'
import ProjectDetail from '@/pages/ProjectDetail'
import About from '@/pages/About'
import Lab from '@/pages/Lab'
import NotFound from '@/pages/NotFound'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Scrolls to top before paint when a page mounts — paired with
 * AnimatePresence "wait" this runs after the old page has exited, so the
 * outgoing view never visibly jumps. `instant` overrides the html-level
 * smooth-scroll so the reset is invisible.
 */
function ScrollRestoration() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <ScrollRestoration />
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<Works />} />
            <Route path="/works/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}
