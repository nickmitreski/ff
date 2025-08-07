import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from './AppIcon';
import Folder from './Folder';

interface AppGridProps {
  appData: Array<{
    id: string;
    type?: 'folder';
    label?: string;
    icon?: string;
    color?: string;
    imageIcon?: string;
    apps?: Array<{
      id: string;
      label: string;
      icon?: string;
      color?: string;
      imageIcon?: string;
    }>;
  }>;
  onAppPress: (appId: string) => void;
  selectedApp: string | null;
  onHomePress: () => void;
}

const AppGrid: React.FC<AppGridProps> = ({ appData, onAppPress, selectedApp, onHomePress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative h-full p-4 pt-6 pb-32 overflow-hidden"
      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
    >
      {/* Black gradient background */}
      <div 
        className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none"
      />
      <div className="relative z-10 h-full flex flex-col justify-end">
        {/* App Grid */}
        <div className="grid grid-cols-4 gap-3 mb-2">
          {appData.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {app.type === 'folder' ? (
                <Folder
                  id={app.id}
                  label={app.label ?? ""}
                  apps={(app.apps ?? []).map(a => ({
                    ...a,
                    icon: a.icon ?? "",
                    color: a.color ?? "",
                    imageIcon: a.imageIcon ?? ""
                  }))}
                  onAppPress={onAppPress}
                  isSelected={selectedApp === app.id}
                />
              ) : (
                <AppIcon
                  {...app}
                  icon={app.icon ?? ""}
                  label={app.label ?? ""}
                  color={app.color ?? ""}
                  imageIcon={app.imageIcon ?? ""}
                  onPress={() => onAppPress(app.id)}
                  isSelected={selectedApp === app.id}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AppGrid; 