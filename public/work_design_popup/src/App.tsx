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
      {/* Background image */}
      <div 
        className="background-image"
        style={{
          backgroundImage: 'url(/BG.png)',
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      />
      
      {/* Parallax layers */}
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
          <img src="/text.png" alt="Text" />
        </div>
      </div>

      {/* Content to enable scrolling */}
      <div className="content">
        <div className="section">
          <h1>Welcome to Our Landing Page</h1>
          <p>Scroll down to see the parallax effect in action!</p>
        </div>
        
        <div className="section">
          <h2>Amazing Features</h2>
          <p>Each layer moves at a different speed creating a stunning depth effect.</p>
        </div>
        
        <div className="section">
          <h2>Beautiful Design</h2>
          <p>The parallax effect adds visual interest and modern appeal to any website.</p>
        </div>
        
        <div className="section">
          <h2>Get Started</h2>
          <p>Ready to create something amazing? Let's build together!</p>
        </div>
        
        <div className="section">
          <h2>Contact Us</h2>
          <p>Get in touch to discuss your next project.</p>
        </div>
      </div>
    </div>
  )
}

export default App 