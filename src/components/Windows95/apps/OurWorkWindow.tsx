import React, { useState } from 'react';

/**
 * Interface for work items displayed in the OurWorkWindow
 */
interface WorkItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  features?: string[];
  url?: string;
  imageUrl?: string;
  color: string;
}

/**
 * OurWorkWindow component displays a portfolio of work in the Windows 95 interface
 * with content from the modern site
 */
const OurWorkWindow: React.FC = () => {
  const categories = [
    { id: 'websites', name: 'Websites', color: '#008CFF' },
    { id: 'videos', name: 'Videos', color: '#FF1493' },
    { id: 'branding', name: 'Branding', color: '#FFCC00' },
    { id: 'design', name: 'Design', color: '#9933FF' },
    { id: 'ai', name: 'AI', color: '#00CC66' },
    { id: 'seo', name: 'SEO', color: '#FF6600' }
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);

  /**
   * Real work items from modern site
   */
  const workItems: WorkItem[] = [
    // Website Projects
    {
      id: 'mg-accounting',
      title: 'MG Accounting',
      category: 'websites',
      description: 'A professional website for an accounting firm that balances corporate trustworthiness with approachable design.',
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
      features: ['Responsive Design', 'Service Showcases', 'Team Profiles', 'Contact Form Integration'],
      url: 'https://www.mgaccounting.com.au/',
      imageUrl: '/mgaccounting.png',
      color: '#008CFF'
    },
    {
      id: 'followfuse',
      title: 'FollowFuse',
      category: 'websites',
      description: 'A dynamic platform for social media management and analytics with modern, tech-forward aesthetic.',
      technologies: ['React', 'TypeScript', 'Styled Components', 'Chart.js'],
      features: ['Interactive Dashboard Demo', 'Feature Showcase', 'Pricing Tables', 'User Testimonials'],
      url: 'https://www.followfuse.com/',
      imageUrl: '/followfuse.png',
      color: '#FF1493'
    },
    {
      id: 'boostr',
      title: 'Boostr',
      category: 'websites',
      description: 'A performance-focused website for a fitness coaching platform emphasizing motivation and results.',
      technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Vercel'],
      features: ['Program Showcases', 'Coach Profiles', 'Testimonial Carousel', 'Membership Portal'],
      url: 'https://boostr-seven.vercel.app/',
      imageUrl: '/brands/boostr.png',
      color: '#FFCC00'
    },
    {
      id: '1-step-ahead',
      title: '1 Step Ahead',
      category: 'websites',
      description: 'An educational platform website with clean, intuitive design prioritizing content accessibility.',
      technologies: ['React', 'Next.js', 'Material UI', 'MongoDB'],
      features: ['Course Catalog', 'Learning Dashboard', 'Progress Tracking', 'Resource Library'],
      url: 'https://1stepahead.vercel.app/',
      imageUrl: '/1stepahead.webp',
      color: '#00CC66'
    },
    {
      id: 'followfuseapp',
      title: 'FollowFuseApp',
      category: 'websites',
      description: 'A mobile app landing page showcasing FollowFuse application features and benefits.',
      technologies: ['React', 'Gatsby', 'Tailwind CSS', 'Netlify'],
      features: ['App Feature Showcase', 'Interactive Demo', 'Download Links', 'User Reviews'],
      url: 'https://followfuseapp.com/',
      imageUrl: '/followfuseapp.png',
      color: '#9933FF'
    },
    {
      id: 'timelox',
      title: 'Timelox',
      category: 'websites',
      description: 'A sleek, modern website for a time management application emphasizing productivity and efficiency.',
      technologies: ['Vue.js', 'Nuxt.js', 'SCSS', 'Firebase'],
      features: ['Feature Tours', 'Pricing Plans', 'User Testimonials', 'Blog Section'],
      url: 'https://timelox-website.vercel.app/',
      imageUrl: '/timelox.png',
      color: '#FF6600'
    },
    // AI Projects
    {
      id: 'chatbot',
      title: 'AI Chatbot',
      category: 'ai',
      description: 'Intelligent conversational agents that engage with customers 24/7, answering questions and providing support.',
      technologies: ['OpenAI', 'Natural Language Processing', 'React', 'Node.js'],
      features: ['24/7 Availability', 'Multi-language Support', 'Integration APIs', 'Analytics Dashboard'],
      color: '#008CFF'
    },
    {
      id: 'voicebot',
      title: 'Voice Assistant',
      category: 'ai',
      description: 'Voice-activated assistants providing natural, hands-free interaction with services.',
      technologies: ['Speech Recognition', 'Text-to-Speech', 'WebRTC', 'AI Processing'],
      features: ['Voice Commands', 'Natural Conversations', 'Multi-platform Support', 'Custom Responses'],
      color: '#00CC66'
    },
    {
      id: 'image-generation',
      title: 'AI Image Generator',
      category: 'ai',
      description: 'Create unique, custom visuals for your brand with AI-powered image generation tools.',
      technologies: ['Stable Diffusion', 'DALL-E API', 'Image Processing', 'React'],
      features: ['Custom Prompts', 'Style Variations', 'Batch Generation', 'High Resolution Output'],
      color: '#FFCC00'
    },
    {
      id: 'lead-generator',
      title: 'AI Lead Generator',
      category: 'ai',
      description: 'Automated systems that identify and engage potential customers across digital channels.',
      technologies: ['Machine Learning', 'Data Analytics', 'CRM Integration', 'Automation'],
      features: ['Lead Scoring', 'Automated Outreach', 'CRM Sync', 'Performance Analytics'],
      color: '#9933FF'
    },
    // Branding Projects
    {
      id: 'brand-identity',
      title: 'Brand Identity Design',
      category: 'branding',
      description: 'Complete brand identity packages including logos, color schemes, and brand guidelines.',
      technologies: ['Adobe Creative Suite', 'Brand Strategy', 'Visual Design', 'Typography'],
      features: ['Logo Design', 'Color Palette', 'Typography System', 'Brand Guidelines'],
      color: '#FFCC00'
    },
    {
      id: 'marketing-materials',
      title: 'Marketing Materials',
      category: 'branding',
      description: 'Comprehensive marketing collateral including brochures, business cards, and digital assets.',
      technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Print Design'],
      features: ['Business Cards', 'Brochures', 'Digital Assets', 'Print-Ready Files'],
      color: '#FF1493'
    },
    // Growth Projects
    {
      id: 'analytics-dashboard',
      title: 'Growth Analytics',
      category: 'seo',
      description: 'Real-time business metrics visualization platform for data-driven decision making.',
      technologies: ['Data Analytics', 'Dashboard Design', 'React', 'Chart.js'],
      features: ['Real-time Metrics', 'Custom Dashboards', 'Data Export', 'Performance Tracking'],
      color: '#FF6600'
    },
    {
      id: 'seo-optimization',
      title: 'SEO Optimization',
      category: 'seo',
      description: 'Search engine optimization strategies to improve online visibility and drive organic traffic.',
      technologies: ['SEO Tools', 'Content Strategy', 'Technical SEO', 'Analytics'],
      features: ['Keyword Research', 'On-page Optimization', 'Content Strategy', 'Performance Monitoring'],
      color: '#00CC66'
    }
  ];

  /**
   * Filter work items based on selected category
   */
  const filteredWork = workItems.filter(item => item.category === selectedCategory);

  return (
    <div className="win95-work" style={{ 
      padding: '16px', 
      height: '100%', 
      overflowY: 'auto',
      background: '#c0c0c0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        background: 'white',
        boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080'
      }}>
        <img src="/Our_Work.png" alt="Our Work" style={{ width: '40px', height: '40px' }} />
        <div>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            margin: '0 0 4px 0',
            color: '#000080'
          }}>
            Our Work Portfolio
          </h2>
          <p style={{ 
            fontSize: '12px', 
            margin: '0',
            color: '#666'
          }}>
            Showcasing our latest projects and achievements
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        background: 'white',
        boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '6px 12px',
                border: '2px solid',
                borderColor: selectedCategory === category.id 
                  ? '#808080 #ffffff #ffffff #808080'
                  : '#ffffff #808080 #808080 #ffffff',
                background: selectedCategory === category.id ? '#c0c0c0' : '#f0f0f0',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                color: selectedCategory === category.id ? '#000080' : '#000',
                boxShadow: selectedCategory === category.id 
                  ? 'inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff'
                  : 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080'
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Work Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {filteredWork.map((item, index) => (
          <div
            key={item.id}
            style={{
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              background: 'white',
              boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
              padding: '16px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Project Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {item.title.charAt(0)}
              </div>
              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  margin: '0 0 2px 0',
                  color: '#000080'
                }}>
                  {item.title}
                </h3>
                <span style={{
                  fontSize: '11px',
                  color: '#666',
                  backgroundColor: '#f0f0f0',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}>
                  {categories.find(c => c.id === item.category)?.name}
                </span>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '12px',
              lineHeight: '1.4',
              margin: '0 0 12px 0',
              color: '#333',
              flex: 1
            }}>
              {item.description}
            </p>

            {/* Technologies */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#666',
                marginBottom: '4px'
              }}>
                Technologies:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
              }}>
                {item.technologies.slice(0, 3).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#e0e0e0',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      color: '#333'
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 3 && (
                  <span style={{
                    fontSize: '10px',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    +{item.technologies.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Features */}
            {item.features && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  Features:
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {item.features.slice(0, 2).map((feature, featureIndex) => (
                    <span
                      key={featureIndex}
                      style={{
                        fontSize: '10px',
                        backgroundColor: '#f0f8ff',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        color: '#0066cc'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                  {item.features.length > 2 && (
                    <span style={{
                      fontSize: '10px',
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      +{item.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            {item.url && (
              <button
                onClick={() => window.open(item.url, '_blank')}
                style={{
                  padding: '6px 12px',
                  border: '2px solid',
                  borderColor: '#ffffff #808080 #808080 #ffffff',
                  background: '#c0c0c0',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#000080',
                  boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
                  alignSelf: 'flex-start'
                }}
              >
                View Project →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        background: 'white',
        boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          margin: '0 0 8px 0',
          color: '#666'
        }}>
          Ready to start your next project?
        </p>
        <p style={{
          fontSize: '11px',
          margin: '0',
          color: '#999'
        }}>
          Contact us to discuss how we can help bring your vision to life
        </p>
      </div>
    </div>
  );
};

export default OurWorkWindow;