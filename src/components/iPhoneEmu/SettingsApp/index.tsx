import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SettingsHeader from './SettingsHeader';

interface SettingsAppProps {
  onClose: () => void;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'select' | 'link';
  value?: boolean | string;
  options?: string[];
}

const SettingsApp: React.FC<SettingsAppProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<SettingItem[]>([
    { id: 'wifi', title: 'Wi-Fi', subtitle: 'Connected to Home Network', type: 'toggle', value: true },
    { id: 'bluetooth', title: 'Bluetooth', subtitle: 'Off', type: 'toggle', value: false },
    { id: 'airplane', title: 'Airplane Mode', type: 'toggle', value: false },
    { id: 'notifications', title: 'Notifications', type: 'link' },
    { id: 'sounds', title: 'Sounds', type: 'link' },
    { id: 'brightness', title: 'Brightness', subtitle: '50%', type: 'select', value: '50%', options: ['25%', '50%', '75%', '100%'] },
    { id: 'wallpaper', title: 'Wallpaper', type: 'link' },
    { id: 'general', title: 'General', type: 'link' },
    { id: 'about', title: 'About', subtitle: 'iPhone OS 1.0', type: 'link' },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id && setting.type === 'toggle'
        ? { ...setting, value: !setting.value }
        : setting
    ));
  };

  const updateSetting = (id: string, value: string) => {
    setSettings(settings.map(setting => 
      setting.id === id
        ? { ...setting, value, subtitle: value }
        : setting
    ));
  };

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full h-full bg-black flex flex-col"
    >
      <SettingsHeader onClose={onClose} />
      
      <div className="flex-1 bg-gray-100">
        <div className="overflow-y-auto h-full">
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              whileHover={{ backgroundColor: '#f0f0f0' }}
              className="contact-row flex items-center justify-between px-4 cursor-pointer"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-800">{setting.title}</div>
                {setting.subtitle && (
                  <div className="text-sm text-gray-500">{setting.subtitle}</div>
                )}
              </div>
              
              <div className="flex items-center">
                {setting.type === 'toggle' && (
                  <div
                    onClick={() => toggleSetting(setting.id)}
                    className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${
                      setting.value ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                        setting.value ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                )}
                
                {setting.type === 'select' && (
                  <select
                    value={setting.value as string}
                    onChange={(e) => updateSetting(setting.id, e.target.value)}
                    className="bg-transparent border-none outline-none text-blue-600 text-right"
                  >
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}
                
                {setting.type === 'link' && (
                  <div className="text-gray-400">›</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsApp; 