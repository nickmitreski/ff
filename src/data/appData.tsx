import React from 'react';
import MyComputer from '../components/Windows95/apps/MyComputer';
import MyDocuments from '../components/Windows95/apps/MyDocuments';
import RecycleBin from '../components/Windows95/apps/RecycleBin';
import Calculator from '../components/Windows95/apps/Calculator';
import InternetExplorer from '../components/Windows95/apps/InternetExplorer';
import MSPaint from '../components/Windows95/apps/MSPaint';
import MediaFolder from '../components/Windows95/apps/MediaFolder';
import GamesFolder from '../components/Windows95/apps/GamesFolder';
import FlashForwardFolder from '../components/Windows95/apps/FlashForwardFolder';
import AIStuffFolder from '../components/Windows95/apps/AIStuffFolder';
import Notepad from '../components/Windows95/apps/Notepad';
import ServicesWindow from '../components/Windows95/apps/ServicesWindow';
import PricingWindow from '../components/Windows95/apps/PricingWindow';
import ContactUsWindow from '../components/Windows95/apps/ContactUsWindow';
import OurWorkWindow from '../components/Windows95/apps/OurWorkWindow';
import TVPlayer from '../components/Windows95/apps/TVPlayer';
import WinampPlayer from '../components/Windows95/apps/WinampPlayer';
import ComingSoon from '../components/Windows95/apps/ComingSoon';
import BasicChatbot from '../components/Windows95/apps/BasicChatbot';
import ImageGenerator from '../components/Windows95/apps/ai/ImageGenerator';
import Chatbot from '../components/Windows95/apps/ai/Chatbot';
import Voicebot from '../components/Windows95/apps/ai/Voicebot';
import GPT90s from '../components/Windows95/apps/ai/GPT90s';
import GameLauncher from '../components/Windows95/apps/GameLauncher';
import ModernStatsPopup from '../components/modern-site/ModernStatsPopup';
import { FOLDER_POPUP_DEFAULT_SIZE } from './folderPopupConfig';

// AppContentProps defines the props passed to app components for opening other apps
export interface AppContentProps {
  onOpenApp: (appId: string, content?: React.ReactNode, title?: string, position?: { x: number; y: number }, sizeOverride?: { width: number; height: number }) => void;
}

// AppConfig describes the configuration for each app/window
export interface AppConfig {
  name: string;
  icon: string;
  iconPosition?: { x: number; y: number };
  windowPosition?: { x: number; y: number };
  defaultSize: { width: number; height: number };
  contentType: 'component' | 'iframe' | 'none';
  component?: React.ComponentType<AppContentProps> | React.ReactNode;
  url?: string;
  type?: string;
  isResizable?: boolean;
  isAlwaysOnTop?: boolean;
}

// AppData is a mapping of app IDs to their configuration
export interface AppData {
  [id: string]: AppConfig;
}

// initialAppData defines all available apps/windows on the desktop
export const initialAppData: AppData = {
  myComputer: {
    name: 'My Computer',
    icon: '/computer.png',
    iconPosition: { x: 20, y: 20 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: MyComputer
  },
  myDocuments: {
    name: 'My Images',
    icon: '/documents.png',
    iconPosition: { x: 20, y: 120 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: MyDocuments
  },
  recycleBin: {
    name: 'Recycle Bin',
    icon: '/recycle.png',
    iconPosition: { x: 20, y: 220 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: RecycleBin
  },
  calculator: {
    name: 'Calculator',
    icon: '/calculator.png',
    iconPosition: { x: 20, y: 320 },
    defaultSize: { width: 250, height: 300 },
    contentType: 'component',
    component: Calculator
  },
  internetExplorer: {
    name: 'Explorer',
    icon: '/Explorer.png',
    iconPosition: { x: 20, y: 420 },
    defaultSize: { width: 1000, height: 600 },
    contentType: 'component',
    component: InternetExplorer,
    type: 'default',
    isResizable: true,
    isAlwaysOnTop: false,
    windowPosition: { x: 60, y: 80 },
  },
  msPaint: {
    name: 'MS Paint',
    icon: '/mspaint.png',
    iconPosition: { x: 20, y: 520 },
    defaultSize: { width: 800, height: 600 },
    contentType: 'component',
    component: MSPaint,
    type: 'default',
    isResizable: true,
    isAlwaysOnTop: false,
    windowPosition: { x: 60, y: 120 },
  },
  winamp: {
    name: 'Winamp',
    icon: '/winamp.png',
    iconPosition: { x: 20, y: 620 },
    defaultSize: { width: 275, height: 116 },
    contentType: 'component',
    component: WinampPlayer
  },
  mediaFolder: {
    name: 'Media',
    icon: '/media.png',
    iconPosition: { x: 130, y: 20 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: MediaFolder
  },
  gamesFolder: {
    name: 'Games',
    icon: '/games.png',
    iconPosition: { x: 130, y: 120 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: GamesFolder
  },
  aiStuffFolder: {
    name: 'AI Stuff',
    icon: '/ai_stuff.png',
    iconPosition: { x: 130, y: 220 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: AIStuffFolder
  },
  tv: {
    name: 'TV',
    icon: '/TV.png',
    iconPosition: { x: 130, y: 320 },
    defaultSize: { width: 600, height: 630 },
    contentType: 'component',
    component: TVPlayer
  },
  notepad: {
    name: 'Notepad',
    icon: '/Notepad_32x32_4.png',
    iconPosition: { x: 130, y: 420 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: Notepad
  },
  flashForwardFolder: {
    name: 'Flash Forward',
    icon: '/flashforward.png',
    iconPosition: { x: 130, y: 520 },
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: FlashForwardFolder
  },
  ourWork: {
    name: 'Our Work',
    icon: '/Our_Work.png',
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: OurWorkWindow
  },
  servicesWindow: {
    name: 'Services',
    icon: '/documents copy.png',
    defaultSize: FOLDER_POPUP_DEFAULT_SIZE,
    contentType: 'component',
    component: ServicesWindow
  },
  pricingWindow: {
    name: 'Pricing',
    icon: '/documents copy.png',
    defaultSize: { width: 600, height: 500 },
    contentType: 'component',
    component: PricingWindow
  },
  contactUsWindow: {
    name: 'Contact Us',
    icon: '/Mailnews13_32x32_4.png',
    defaultSize: { width: 400, height: 500 },
    contentType: 'component',
    component: ContactUsWindow
  },
  // AI Chatbot entry
  basicChatbot: {
    name: 'Basic Chatbot',
    icon: '/90schatbot.png',
    defaultSize: { width: 400, height: 600 },
    contentType: 'component',
    component: BasicChatbot,
    isResizable: true,
  },
  // Coming Soon entries
  'comingSoon-mario': {
    name: 'Super Mario - Coming Soon',
    icon: '/mario.png',
    defaultSize: { width: 600, height: 400 },
    contentType: 'component',
    component: (props: AppContentProps) => <ComingSoon {...props} featureName="Super Mario" />,
  },
  'comingSoon-zelda': {
    name: 'Zelda - Coming Soon',
    icon: '/zelda.png',
    defaultSize: { width: 600, height: 400 },
    contentType: 'component',
    component: (props: AppContentProps) => <ComingSoon {...props} featureName="Legend of Zelda" />,
  },
  'comingSoonTetris': {
    name: 'Tetris - Coming Soon',
    icon: '/tetris.png',
    defaultSize: { width: 600, height: 400 },
    contentType: 'component',
    component: (props: AppContentProps) => <ComingSoon {...props} featureName="Tetris" />,
  },
  // External games added via folderItemsData
  'external-streetfighter': {
    name: 'Street Fighter',
    icon: '/games/StreetFighter-main/icon.png',
    defaultSize: { width: 1000, height: 600 },
    contentType: 'iframe',
    url: '/games/StreetFighter-main/index.html'
  },
  'external-racer': {
    name: 'Racer',
    icon: '/games/racer/icon.png',
    defaultSize: { width: 1000, height: 600 },
    contentType: 'iframe',
    url: '/games/racer/index.html'
  },
  'external-newsmp4': {
    name: 'News.mp4',
    icon: '/promovids.png',
    defaultSize: { width: 1000, height: 750 }, // 2.5 times original size
    contentType: 'iframe',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/news_promo.mp4',
  },
  'external-promomp4': {
    name: 'Promo.mp4',
    icon: '/promovids.png',
    defaultSize: { width: 1000, height: 750 }, // 2.5 times original size
    contentType: 'iframe',
    url: 'https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4',
  },
  // AI Tools - Properly defined with their own components
  imageGenerator: {
    name: 'Image Generator',
    icon: '/imagegen.png',
    defaultSize: { width: 600, height: 700 },
    contentType: 'component',
    component: ImageGenerator,
    isResizable: true,
  },
  chatbot: {
    name: 'Chatbot',
    icon: '/90schatbot.png',
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: Chatbot,
    isResizable: true,
  },
  voicebot: {
    name: 'Voicebot',
    icon: '/callagent.png',
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: Voicebot,
    isResizable: true,
  },
  gpt90s: {
    name: '90sGPT',
    icon: '/90sgpt.png',
    defaultSize: { width: 500, height: 600 },
    contentType: 'component',
    component: GPT90s,
    isResizable: true,
  },
  // Game launchers
  'game-mario': {
    name: 'Super Mario',
    icon: '/mario.png',
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/mario_js-master/index.html" gameName="Super Mario" />
    ),
    isResizable: true,
  },
  'game-zelda': {
    name: 'Legend of Zelda',
    icon: '/zelda.png',
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/zelda-js-master/index.html" gameName="Legend of Zelda" />
    ),
    isResizable: true,
  },
  'game-mk-wiki': {
    name: 'Mortal Kombat Wiki',
    icon: '/mortalkombat.png',
    defaultSize: { width: 800, height: 650 },
    contentType: 'component',
    component: (props: AppContentProps) => (
      <GameLauncher {...props} gameUrl="/games/MK-Wiki-master/index.html" gameName="Mortal Kombat Wiki" />
    ),
    isResizable: true,
  },
  // Stats Page
  statsPage: {
    name: 'Update',
    icon: '/update.png',
    defaultSize: { width: 800, height: 600 },
    contentType: 'component',
    component: (props: AppContentProps & { onContinueToModernSite?: () => void }) => (
      <ModernStatsPopup isOpen={true} onClose={() => {}} onContinueToModernSite={props.onContinueToModernSite || (() => {})} />
    ),
    isResizable: true,
    windowPosition: { x: 60, y: 120 },
  }
};