import React, { useState } from 'react';

/**
 * PricingWindow component displays pricing plans in the Windows 95 interface
 * with styling inspired by the modern site
 */
const PricingWindow: React.FC = () => {
  const [pricingType, setPricingType] = useState<'websites' | 'services'>('websites');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const plans = [
    {
      id: 'basic',
      title: 'Basic',
      icon: '/WEBSITES.webp',
      description: 'Perfect for small businesses looking to establish their digital presence.',
      price: '$999',
      color: '#008CFF',
      features: ['Custom Website Design', 'Up to 5 pages', 'Mobile Responsive', 'Basic SEO Setup', '1 Month Support']
    },
    {
      id: 'pro',
      title: 'Pro',
      icon: '/BRANDING.png',
      description: 'Ideal for growing businesses ready to expand their digital footprint.',
      price: '$1,499',
      color: '#FFCC00',
      features: ['Everything in Basic', 'Advanced onsite SEO', 'Up to 10 pages', '3 Months Support', 'Social Media Setup', 'Promotional or explainer video for website', 'Analytics Setup'],
      popular: true
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      icon: '/AI.png',
      description: 'Comprehensive solution for established businesses seeking digital excellence.',
      price: '$2,499',
      color: '#00CC66',
      features: ['Everything in Pro', 'Custom Features', 'API Integrations', 'Performance Optimization', 'Advanced onsite SEO', '6 Months Support', 'Analytics Setup', 'Custom backend CRM / Dashboard', '2 x custom ai automation set ups']
    }
  ];

  // Subscription categories (copied from modern site)
  const subscriptionCategories = [
    {
      key: 'websites',
      title: 'Website Services',
      color: '#008CFF',
      services: [
        { name: 'Fast & secure managed hosting', price: 19 },
        { name: 'SSL Certificate', price: 9 },
        { name: 'Daily Backups', price: 9 },
        { name: 'Ongoing Support & Updates', price: 59 },
        { name: 'Performance Optimisation', price: 49 },
        { name: 'Security Monitoring', price: 19 }
      ]
    },
    {
      key: 'content',
      title: 'Content Services',
      color: '#FFCC00',
      services: [
        { name: 'Content Updates', price: 99 },
        { name: 'Blog Writing (4 SEO-optimized blog posts/mo.)', price: 149 },
        { name: 'Social Media Management', price: 249 },
        { name: 'Custom AI image creation service', price: 49 },
        { name: 'Custom AI Video creation service', price: 99 }
      ]
    },
    {
      key: 'ai',
      title: 'AI Services',
      color: '#00CC66',
      services: [
        { name: 'AI Website Chatbot', price: 149 },
        { name: 'AI Analytics Dashboard', price: 89 },
        { name: 'AI Automation (3 x custom workflows)', price: 149 },
        { name: 'AI Voice Agent (Calls/SMS)', price: 249 },
        { name: 'AI Voice Receptionist (Incoming calls)', price: 249 }
      ]
    }
  ];

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  const calculateTotal = () => {
    return subscriptionCategories
      .flatMap(category => category.services)
      .filter(service => selectedServices.includes(service.name))
      .reduce((total, service) => total + service.price, 0);
  };

  return (
    <div className="win95-pricing" style={{
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
        <img src="/flashforward.png" alt="Flash Forward" style={{ width: '40px', height: '40px' }} />
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0,
            color: '#000080'
          }}>
            Pricing
          </h2>
          <p style={{
            fontSize: '12px',
            margin: '4px 0 0 0',
            color: '#666666'
          }}>
            Choose the perfect plan or subscription for your business needs
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
        gap: '0',
        background: '#e0e0e0',
        borderRadius: '8px',
        border: '2px solid #808080',
        boxShadow: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setPricingType('websites')}
          style={{
            padding: '8px 32px',
            background: pricingType === 'websites' ? '#fff' : 'transparent',
            color: pricingType === 'websites' ? '#000080' : '#333',
            fontWeight: 'bold',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            borderRight: '1px solid #808080',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          Websites
        </button>
        <button
          onClick={() => setPricingType('services')}
          style={{
            padding: '8px 32px',
            background: pricingType === 'services' ? '#fff' : 'transparent',
            color: pricingType === 'services' ? '#000080' : '#333',
            fontWeight: 'bold',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s, color 0.2s'
          }}
        >
          Services
        </button>
      </div>

      {/* Content */}
      {pricingType === 'websites' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          padding: '4px'
        }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              border: '2px solid',
              borderColor: plan.popular ? '#000080' : '#ffffff #808080 #808080 #ffffff',
              background: 'white',
              boxShadow: plan.popular 
                ? 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080, 0 0 0 2px #000080' 
                : 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
              cursor: 'default',
              transition: 'all 0.15s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#000080',
                  color: 'white',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  borderRadius: '4px',
                  zIndex: 1
                }}>
                  POPULAR
                </div>
              )}
              {/* Top Accent */}
              <div style={{
                height: '4px',
                background: plan.color,
                width: '100%'
              }} />
              {/* Plan Content */}
              <div style={{ padding: '16px' }}>
                {/* Header with Icon and Title */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${plan.color}15`,
                    border: `2px solid ${plan.color}`,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <img 
                      src={plan.icon} 
                      alt={plan.title} 
                      style={{ width: '24px', height: '24px' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold', 
                      margin: 0,
                      color: '#000080'
                    }}>
                      {plan.title}
                    </h3>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: plan.color,
                      marginTop: '2px'
                    }}>
                      {plan.price}
                    </div>
                  </div>
                </div>
                {/* Description */}
                <p style={{
                  fontSize: '12px',
                  lineHeight: '1.4',
                  margin: '0 0 12px 0',
                  color: '#333333'
                }}>
                  {plan.description}
                </p>
                {/* Features */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: '#000080',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Includes:
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <div key={index} style={{
                        fontSize: '11px',
                        color: '#333333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <div style={{
                          width: '4px',
                          height: '4px',
                          background: plan.color,
                          borderRadius: '50%',
                          flexShrink: 0
                        }}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <div style={{
                        fontSize: '10px',
                        color: plan.color,
                        fontWeight: 'bold',
                        marginTop: '4px',
                        fontStyle: 'italic'
                      }}>
                        +{plan.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          padding: '4px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {subscriptionCategories.map((category) => (
            <div key={category.key} style={{
              border: '2px solid #ffffff',
              background: 'white',
              boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 0
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: category.color,
                marginBottom: '16px',
                textAlign: 'center',
                textShadow: '1px 1px 0 #fff'
              }}>{category.title}</h3>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {category.services.map((service, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: selectedServices.includes(service.name) ? '#e0f7fa' : '#f5f5f5',
                    border: `1.5px solid ${selectedServices.includes(service.name) ? category.color : '#bdbdbd'}`,
                    borderRadius: '6px',
                    padding: '8px 12px',
                    transition: 'background 0.2s, border 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleService(service.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        border: `2px solid ${category.color}`,
                        background: selectedServices.includes(service.name) ? category.color : '#fff',
                        borderRadius: '3px',
                        marginRight: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s, border 0.2s'
                      }}>
                        {selectedServices.includes(service.name) && (
                          <div style={{
                            width: '6px',
                            height: '6px',
                            background: '#fff',
                            borderRadius: '1px',
                            margin: 'auto'
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: '13px', color: '#222', fontWeight: 500 }}>{service.name}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#222', fontWeight: 500 }}>${service.price}/mo</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services total (only show in services mode) */}
      {pricingType === 'services' && (
        <div style={{
          marginTop: '24px',
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '16px',
          border: '2px solid #808080',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: 'inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '13px', color: '#000080', fontWeight: 'bold' }}>Total Monthly Investment</span>
          <div style={{ fontSize: '24px', color: '#000080', fontWeight: 'bold', marginTop: '8px' }}>${calculateTotal()}/mo</div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        border: '2px solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        background: '#c0c0c0',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '12px',
          margin: 0,
          color: '#000000',
          fontWeight: 'bold'
        }}>
          Need a custom solution? Contact us for a personalized quote!
        </p>
      </div>
    </div>
  );
};

export default PricingWindow;