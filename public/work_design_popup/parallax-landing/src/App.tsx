import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app">
      {/* First parallax section */}
      <div className={`parallax-section first-section ${scrollY > 500 ? 'fade-out' : ''}`}>
        <div className="parallax-container">
          {/* Layer 1 - slowest */}
          <div 
            className="parallax-layer layer-1"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`
            }}
          >
            <img src="/1.png" alt="Layer 1" />
          </div>

          {/* Layer 2 */}
          <div 
            className="parallax-layer layer-2"
            style={{
              transform: `translateY(${scrollY * 0.4}px)`
            }}
          >
            <img src="/2.png" alt="Layer 2" />
          </div>

          {/* Layer 3 */}
          <div 
            className="parallax-layer layer-3"
            style={{
              transform: `translateY(${scrollY * 0.6}px)`
            }}
          >
            <img src="/3.png" alt="Layer 3" />
          </div>

          {/* Layer 4 */}
          <div 
            className="parallax-layer layer-4"
            style={{
              transform: `translateY(${scrollY * 0.8}px)`
            }}
          >
            <img src="/4.png" alt="Layer 4" />
          </div>

          {/* Layer 5 */}
          <div 
            className="parallax-layer layer-5"
            style={{
              transform: `translateY(${scrollY * 1.0}px)`
            }}
          >
            <img src="/5.png" alt="Layer 5" />
          </div>

          {/* Text layer - fastest */}
          <div 
            className="parallax-layer text-layer"
            style={{
              transform: `translateY(${scrollY * 1.2}px)`
            }}
          >
            <img src="/websites_text.png" alt="Websites Text" />
          </div>
        </div>
      </div>

      {/* Second parallax section */}
      <div className={`parallax-section second-section ${scrollY > 500 ? 'active' : ''}`}>
        <div className="parallax-container">


          {/* App Layer 2 */}
          <div 
            className="parallax-layer app-layer-2"
            style={{
              transform: `translateY(${(scrollY - 1000) * 0.4}px)`
            }}
          >
            <img src="/app2.png" alt="App Layer 2" />
          </div>

          {/* App Layer 3 */}
          <div 
            className="parallax-layer app-layer-3"
            style={{
              transform: `translateY(${(scrollY - 1000) * 0.6}px)`
            }}
          >
            <img src="/app3.png" alt="App Layer 3" />
          </div>

          {/* App Layer 4 */}
          <div 
            className="parallax-layer app-layer-4"
            style={{
              transform: `translateY(${(scrollY - 1000) * 0.8}px)`
            }}
          >
            <img src="/app4.png" alt="App Layer 4" />
          </div>

          {/* App Layer 5 */}
          <div 
            className="parallax-layer app-layer-5"
            style={{
              transform: `translateY(${(scrollY - 1000) * 1.0}px)`
            }}
          >
            <img src="/app5.png" alt="App Layer 5" />
          </div>

          {/* App Layer 6 */}
          <div 
            className="parallax-layer app-layer-6"
            style={{
              transform: `translateY(${(scrollY - 1000) * 1.1}px)`
            }}
          >
            <img src="/app6.png" alt="App Layer 6" />
          </div>

          {/* App Layer 7 */}
          <div 
            className="parallax-layer app-layer-7"
            style={{
              transform: `translateY(${(scrollY - 1000) * 1.2}px)`
            }}
          >
            <img src="/app7.png" alt="App Layer 7" />
          </div>

          {/* App Layer 8 */}
          <div 
            className="parallax-layer app-layer-8"
            style={{
              transform: `translateY(${(scrollY - 1000) * 1.3}px)`
            }}
          >
            <img src="/app8.png" alt="App Layer 8" />
          </div>

          {/* App Text layer - fastest */}
          <div 
            className="parallax-layer app-text-layer"
            style={{
              transform: `translateY(${(scrollY - 1000) * 1.4}px)`
            }}
          >
            <img src="/app_design.png" alt="App Design Text" />
          </div>
        </div>
      </div>

      {/* Third parallax section */}
      <div className={`parallax-section third-section ${scrollY > 1500 ? 'active' : ''}`}>
        <div className="parallax-container">
          {/* Logo Layer 1 - slowest */}
          <div 
            className="parallax-layer logo-layer-1"
            style={{
              transform: `translateY(${(scrollY - 2000) * 0.2}px)`
            }}
          >
            <img src="/l1.png" alt="Logo Layer 1" />
          </div>

          {/* Logo Layer 2 */}
          <div 
            className="parallax-layer logo-layer-2"
            style={{
              transform: `translateY(${(scrollY - 2000) * 0.4}px)`
            }}
          >
            <img src="/l2.png" alt="Logo Layer 2" />
          </div>

          {/* Logo Layer 3 */}
          <div 
            className="parallax-layer logo-layer-3"
            style={{
              transform: `translateY(${(scrollY - 2000) * 0.6}px)`
            }}
          >
            <img src="/l3.png" alt="Logo Layer 3" />
          </div>

          {/* Logo Layer 4 */}
          <div 
            className="parallax-layer logo-layer-4"
            style={{
              transform: `translateY(${(scrollY - 2000) * 0.8}px)`
            }}
          >
            <img src="/l4.png" alt="Logo Layer 4" />
          </div>

          {/* Logo Layer 5 */}
          <div 
            className="parallax-layer logo-layer-5"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.0}px)`
            }}
          >
            <img src="/l5.png" alt="Logo Layer 5" />
          </div>

          {/* Logo Layer 6 */}
          <div 
            className="parallax-layer logo-layer-6"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.1}px)`
            }}
          >
            <img src="/l6.png" alt="Logo Layer 6" />
          </div>

          {/* Logo Layer 7 */}
          <div 
            className="parallax-layer logo-layer-7"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.2}px)`
            }}
          >
            <img src="/l7.png" alt="Logo Layer 7" />
          </div>

          {/* Logo Layer 8 */}
          <div 
            className="parallax-layer logo-layer-8"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.3}px)`
            }}
          >
            <img src="/l8.png" alt="Logo Layer 8" />
          </div>

          {/* Logo Layer 9 */}
          <div 
            className="parallax-layer logo-layer-9"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.4}px)`
            }}
          >
            <img src="/l9.png" alt="Logo Layer 9" />
          </div>

          {/* Logo Text layer - fastest */}
          <div 
            className="parallax-layer logo-text-layer"
            style={{
              transform: `translateY(${(scrollY - 2000) * 1.5}px)`
            }}
          >
            <img src="/Logo_text.png" alt="Logo Text" />
          </div>
        </div>
      </div>

      {/* Content to enable scrolling */}
      <div className="content">
        <div style={{ height: '300vh' }}></div>
      </div>
    </div>
  )
}

export default App
