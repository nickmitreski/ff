import React from 'react';
import AppIcon from './AppIcon';

interface DockProps {
  onAppPress: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ onAppPress }) => {
  const dockApps = [
    { id: 'phone', icon: 'Phone', label: 'Phone', imageIcon: '/icons/iPhone_OS_Icons/Phone.png', color: '' },
    { id: 'mail', icon: 'Mail', label: 'Contact Us', imageIcon: '/icons/iPhone_OS_Icons/Mail.png', color: '' },
    { id: 'safari', icon: 'Safari', label: 'Modern Site', imageIcon: '/icons/iPhone_OS_Icons/Safari.png', color: '' },
    { id: 'videos', icon: 'iPod', label: 'Videos', imageIcon: '/icons/iPhone_OS_Icons/iPod.png', color: '' },
  ];

  return (
    <div className="absolute left-0 bottom-0 w-full flex flex-col items-center z-30">
      <div 
        className="relative w-full h-16 rounded-none flex items-center justify-center shadow-2xl border-t border-white/20"
        style={{
          background: `
            repeating-linear-gradient(
              135deg,
              rgba(255,255,255,0.25) 0px,
              rgba(255,255,255,0.25) 2px,
              transparent 2px,
              transparent 6px
            ),
            rgba(255,255,255,0.35)
          `,
          boxShadow: '0 10px 32px 0 rgba(0,0,0,0.25), 0 1.5px 0 0 rgba(255,255,255,0.18) inset'
        }}
      >
        
        {/* Dock Apps */}
        <div className="relative w-full flex justify-between items-end z-10 px-6 -mt-6">
          {dockApps.map((app) => (
            <div key={app.id} className="flex flex-col items-center">
              <div className="drop-shadow-lg">
                <AppIcon
                  {...app}
                  onPress={() => onAppPress(app.id)}
                  isSelected={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dock;