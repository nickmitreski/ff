import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors, typography, spacing, transitions, effects } from '../../theme/theme';
import { NeonCard } from './NeonCard';

interface PricingSectionProps {
  className?: string;
}

interface SubscriptionCategory {
  title: string;
  color: string;
  services: Array<{
    name: string;
    price: number;
  }>;
}

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  color: string;
}

const subscriptionCategories: Record<string, SubscriptionCategory> = {
  websites: {
    title: "Website Services",
    color: colors.text.white,
    services: [
      { name: "Fast & secure managed hosting", price: 19 },
      { name: "SSL Certificate", price: 9 },
      { name: "Daily Backups", price: 9 },
      { name: "Ongoing Support & Updates", price: 59 },
      { name: "Performance Optimisation", price: 49 },
      { name: "Security Monitoring", price: 19 }
    ]
  },
  content: {
    title: "Content Services",
    color: colors.text.white,
    services: [
      { name: "Content Updates", price: 99 },
      { name: "Blog Writing (4 SEO-optimized blog posts/mo.)", price: 149 },
      { name: "Social Media Management", price: 249 },
      { name: "Custom AI image creation service", price: 49 },
      { name: "Custom AI Video creation service", price: 99 }
    ]
  },
  ai: {
    title: "AI Services",
    color: colors.text.white,
    services: [
      { name: "AI Website Chatbot", price: 149 },
      { name: "AI Analytics Dashboard", price: 89 },
      { name: "AI Automation (3 x custom workflows)", price: 149 },
      { name: "AI Voice Agent (Calls/SMS)", price: 249 },
      { name: "AI Voice Receptionist (Incoming calls)", price: 249 }
    ]
  }
};

const pricingPlans: PricingPlan[] = [
  {
    title: "Basic",
    price: "$999",
    description: "Perfect for small businesses looking to establish their digital presence.",
    features: [
      "Custom Website Design",
      "Up to 5 pages",
      "Mobile Responsive",
      "Basic SEO Setup",
      "1 Month Support"
    ],
    color: colors.text.white
  },
  {
    title: "Pro",
    price: "$1,499",
    description: "Ideal for growing businesses ready to expand their digital footprint.",
    features: [
      "Everything in Basic",
      "Advanced onsite SEO",
      "Up to 10 pages",
      "3 Months Support",
      "Social Media Setup",
      "Promotional or explainer video for website",
      "Analytics Setup"
    ],
    color: colors.text.white
  },
  {
    title: "Enterprise",
    price: "$2,499",
    description: "Comprehensive solution for established businesses seeking digital excellence.",
    features: [
      "Everything in Pro",
      "Custom Features",
      "API Integrations",
      "Performance Optimization",
      "Advanced onsite SEO",
      "6 Months Support",
      "Analytics Setup",
      "Custom backend CRM / Dashboard",
      "2 x custom ai automation set ups"
    ],
    color: colors.text.white
  }
];

const PricingCard: React.FC<{ plan: PricingPlan; index: number }> = ({ plan, index }) => {
  return (
    <NeonCard index={index} hasPadding={true}>
      <div className="flex flex-col h-full">
        <h3 
          className={`${typography.fontSize.xl} ${typography.fontFamily.light} ${typography.tracking.tight} mb-4`}
          style={{ color: colors.text.white }}
        >
          {plan.title}
        </h3>
        <div 
          className={`${typography.fontSize['4xl']} ${typography.fontFamily.light} ${typography.tracking.tighter} mb-6`}
          style={{ color: colors.text.white }}
        >
          {plan.price}
        </div>
        <ul className="space-y-4 flex-grow">
          {plan.features.map((feature, i) => (
            <li 
              key={i}
              className={`${colors.text.gray[400]} ${typography.fontFamily.light} ${typography.tracking.tight} flex items-center`}
            >
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </NeonCard>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({ className = "" }) => {
  const [pricingType, setPricingType] = useState<'websites' | 'services'>('websites');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const calculateTotal = () => {
    return Object.values(subscriptionCategories)
      .flatMap(category => category.services)
      .filter(service => selectedServices.includes(service.name))
      .reduce((total, service) => total + service.price, 0);
  };

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName) 
        ? prev.filter(name => name !== serviceName)
        : [...prev, serviceName]
    );
  };

  return (
    <section id="pricing" className={`${spacing.section.padding} ${typography.tracking.tight} bg-black/50 ${className}`}>
      <div className={`container mx-auto ${spacing.container.padding}`}>
        <h2 className={`${typography.fontSize['4xl']} sm:text-5xl lg:text-[64px] ${colors.text.white} text-center mb-12 ${typography.tracking.tighter} font-bold`}>
          pricing
        </h2>
        
        <div className="flex justify-center mb-12">
          <div className="pricing-toggle relative flex items-center bg-black/80 p-1 rounded-full border border-[#008CFF] overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 rounded-full bg-[#008CFF] z-0"
              initial={false}
              animate={{
                x: pricingType === 'websites' ? 0 : '100%',
                width: '50%'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setPricingType('websites')}
              className={`relative flex-1 px-6 py-2 rounded-full text-sm ${typography.fontFamily.light} ${transitions.colors} z-10 focus:outline-none focus:ring-2 focus:ring-[#008CFF] ${
                pricingType === 'websites' ? 'text-black font-bold bg-[#008CFF]' : 'text-gray-400 font-light bg-transparent'
              }`}
              aria-pressed={pricingType === 'websites'}
            >
              Websites
            </button>
            <button
              onClick={() => setPricingType('services')}
              className={`relative flex-1 px-6 py-2 rounded-full text-sm ${typography.fontFamily.light} ${transitions.colors} z-10 focus:outline-none focus:ring-2 focus:ring-[#008CFF] ${
                pricingType === 'services' ? 'text-black font-bold bg-[#008CFF]' : 'text-gray-400 font-light bg-transparent'
              }`}
              aria-pressed={pricingType === 'services'}
            >
              Services
            </button>
          </div>
        </div>

        {pricingType === 'services' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Object.entries(subscriptionCategories).map(([key, category], index) => (
                <div key={key} className="flex flex-col items-center">
                  <h3 className={`${typography.fontSize['2xl']} ${typography.fontFamily.light} mb-6 text-center ${typography.tracking.tight}`} style={{ color: colors.text.white }}>
                    {category.title}
                  </h3>
                  
                  <NeonCard index={index} className="flex flex-col p-6 w-full">
                    <div className="space-y-4 w-full">
                      {category.services.map((service, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between rounded-lg border-[0.5px] ${transitions.all} hover:bg-black/20 p-4`}
                          style={{
                            borderColor: selectedServices.includes(service.name) ? colors.text.white : colors.border.dark
                          }}
                        >
                          <div className="flex items-center flex-grow mr-4">
                            <span className={`${colors.text.white} ${typography.fontFamily.light} mr-2`}>•</span>
                            <span className={`${colors.text.white} ${typography.fontFamily.light}`}>{service.name}</span>
                          </div>
                          <span className={`${typography.fontFamily.light} ${colors.text.white} mr-4`}>${service.price}/mo</span>
                          <button
                            onClick={() => toggleService(service.name)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ${transitions.colors} ${effects.focus.outline}`}
                            style={{ 
                              backgroundColor: selectedServices.includes(service.name) ? colors.text.white : colors.border.light
                            }}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 ${transitions.all} ${
                                selectedServices.includes(service.name) ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </NeonCard>
                </div>
              ))}
            </div>

            <NeonCard className="mt-8 max-w-md mx-auto p-6">
              <div className="flex flex-col items-center w-full">
                <span className={`${colors.text.white} ${typography.fontFamily.light} mb-2 text-center`}>Total Monthly Investment</span>
                <span className={`${typography.fontSize['3xl']} ${typography.fontFamily.light} ${colors.text.white} mb-4 text-center`}>${calculateTotal()}/mo</span>
              </div>
            </NeonCard>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 