import React from 'react';
import ComingSoonPopup from '../components/ComingSoonPopup';



export interface FolderItem {
  name: string;
  icon: string;
  appId?: string; // For built-in apps
  path?: string; // For external games/content
  isBuiltIn?: boolean; // To differentiate built-in games from external ones
  audioUrls?: string[]; // Add optional array for audio URLs
  openOnSingleClick?: boolean; // Add optional property for single-click behavior
  component?: React.ComponentType<any>; // Use a more general type to allow different component types
  defaultSize?: { width: number; height: number }; // Add optional defaultSize property
};

export const games: FolderItem[] = [
  {
    name: 'Freecell',
    icon: '/Freecell1_32x32_4.png', // Updated to Freecell logo
    path: '/games/FreecellJS-master/FreecellJS.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 600 },
  },
  {
    name: 'Solitaire',
    icon: '/sollitaire.png', // Updated to new Solitaire icon and moved up
    path: '/games/solitaire-minesweeper/index.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'Duck Hunt',
    icon: '/duckhunt.png',
    path: '/games/DuckHunt-JS-master/dist/index.html',
    isBuiltIn: false,
    defaultSize: { width: 800, height: 600 },
  },
  {
    name: 'Super Mario',
    icon: '/mario.png',
    path: '/games/mario-master-2/indexmario.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'Doom',
    icon: '/doom.png', // Updated to new Doom icon
    path: '/games/doom/doom.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'Diablo',
    icon: '/diablo.png', // Updated to new Diablo icon
    path: '/games/diablo/index.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'Mortal Kombat',
    icon: '/mortalkombat.png',
    isBuiltIn: true,
    appId: 'comingSoonMortalKombat',
    component: ComingSoonPopup,
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: 'Tower Defense',
    icon: '/games/military_tower_defense/army_game.png',
    path: '/games/military_tower_defense/index.html',
    isBuiltIn: false,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    name: 'Donkey Kong',
    icon: '/donkeykong.png',
    path: '/games/donkeykongbananza/index.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'Street Fighter',
    icon: '/streetfighter.png',
    isBuiltIn: true,
    appId: 'comingSoonStreetFighter',
    component: ComingSoonPopup,
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: 'NBA Jam',
    icon: '/nbajam.png',
    isBuiltIn: true,
    appId: 'comingSoonNBAJam',
    component: ComingSoonPopup,
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: 'Legend of Zelda',
    icon: '/zelda.png',
    isBuiltIn: true,
    appId: 'comingSoonZelda',
    component: ComingSoonPopup,
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: 'Prince of Persia',
    icon: '/princeofpersia.png', // Updated to new Prince of Persia icon
    path: '/games/PrinceJS-master/index.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
  {
    name: 'C&C Red Alert',
    icon: '/Red_Alert.png',
    isBuiltIn: true,
    appId: 'comingSoonRedAlert',
    component: ComingSoonPopup, // Will be replaced with a custom email form component
    defaultSize: { width: 600, height: 400 },
  },
  {
    name: 'Sonic',
    icon: '/sonic.png',
    path: '/games/sonic_mega_classic_collection/index.html',
    isBuiltIn: false,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    name: 'Pac-Man',
    icon: '/pacman.png',
    path: '/games/pacman/index.html',
    isBuiltIn: false,
    defaultSize: { width: 900, height: 700 },
  },
];

export const flashForwardFolders: FolderItem[] = [
  { 
    name: 'Services', 
    icon: '/documents copy.png', 
    appId: 'servicesWindow', 
    isBuiltIn: true 
  },
  { 
    name: 'Pricing', 
    icon: '/documents copy.png', 
    appId: 'pricingWindow', 
    isBuiltIn: true 
  },
  {
    name: 'Testimonials',
    icon: '/testimonials.png',
    audioUrls: [
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/5.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/2.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/8.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/16.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/15.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/4.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/9.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/13.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/12.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/11.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/7.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/14.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/17.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/3.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/19.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/6.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/1.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/18.mp3',
      'https://file.garden/Zxsc5-9aojhlnJO6/testimonials/10.mp3'
    ],
    openOnSingleClick: true
  },
  { 
    name: 'Contact us', 
    icon: '/phone.png', 
    appId: 'contactUsWindow', 
    isBuiltIn: true 
  },
  { 
    name: 'Our Work', 
    icon: '/Our_Work.png', 
    appId: 'ourWork', 
    isBuiltIn: true 
  },
  { 
    name: 'Update', 
    icon: '/update.png', 
    appId: 'statsPage', 
    isBuiltIn: true 
  }
];

export const mediaItems: FolderItem[] = [
  {
    name: 'News.mp4',
    icon: '/promovids.png',
    path: 'https://file.garden/Zxsc5-9aojhlnJO6/news_promo.mp4',
    isBuiltIn: false,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    name: 'Promo.mp4',
    icon: '/promovids.png',
    path: 'https://file.garden/Zxsc5-9aojhlnJO6/flashforowarddraft.mp4',
    isBuiltIn: false,
    defaultSize: { width: 1200, height: 800 },
  },
  {
    name: 'Content',
    icon: '/promovids.png',
    path: 'https://file.garden/Zxsc5-9aojhlnJO6/content_promo.mp4',
    isBuiltIn: false,
    defaultSize: { width: 1200, height: 800 },
  }
];

export const aiItems: FolderItem[] = [
  {
    name: 'Image Generator',
    icon: '/imagegen.png',
    appId: 'imageGenerator',
    isBuiltIn: true,
  },
  {
    name: 'Chatbot',
    icon: '/90schatbot.png',
    appId: 'chatbot',
    isBuiltIn: true,
  },
  {
    name: 'Voicebot',
    icon: '/callagent.png',
    appId: 'voicebot',
    isBuiltIn: true,
  },
  {
    name: '90sGPT',
    icon: '/90sgpt.png',
    appId: 'gpt90s',
    isBuiltIn: true,
  },
];

export const myComputerItems: FolderItem[] = [
  {
    name: 'Local Disk (C:)',
    icon: '/local_disk.png',
    isBuiltIn: false
  },
  {
    name: 'CD-ROM (D:)',
    icon: '/cd_rom.png',
    isBuiltIn: false
  },
  {
    name: 'Network',
    icon: '/network.png',
    isBuiltIn: false
  },
  {
    name: 'Control Panel',
    icon: '/control_panel.png',
    isBuiltIn: false
  },
  {
    name: '2k Virus',
    icon: '/application.png',
    isBuiltIn: false
  },
  {
    name: 'MS-DOS',
    icon: '/MsDos_32x32_32.png',
    isBuiltIn: false
  },
  {
    name: 'File Cabinet',
    icon: '/Winfile1_32x32_4.png',
    isBuiltIn: false
  },
  {
    name: 'File Manager',
    icon: '/Winfile3_32x32_1.png',
    isBuiltIn: false
  },
  {
    name: 'Microsoft Network',
    icon: '/MicrosoftNetwork_32x32_4.png',
    isBuiltIn: false
  },
  {
    name: 'Help',
    icon: '/HelpBook_32x32_4.png',
    isBuiltIn: false
  },
  {
    name: 'System Tools',
    icon: '/FolderSettings_32x32_4.png',
    isBuiltIn: false
  },
  {
    name: 'Readme.txt',
    icon: '/document.png',
    isBuiltIn: false
  },
];

export const myDocumentItems: FolderItem[] = [
  {
    name: 'jam_session.jpg',
    icon: '/images.png',
    path: '/jam_session.jpg',
    isBuiltIn: false
  },
  {
    name: 'Tommy+Pam.jpg',
    icon: '/images.png',
    path: '/Tommy+Pam.jpg',
    isBuiltIn: false
  },
  {
    name: 'Friends.jpg',
    icon: '/images.png',
    path: '/Friends.jpg',
    isBuiltIn: false
  },
  {
    name: 'iconic_cindy.jpg',
    icon: '/images.png',
    path: '/iconic_cindy.jpg',
    isBuiltIn: false
  },
  {
    name: 'schwinggg.jpg',
    icon: '/images.png',
    path: '/schwinggg.jpg',
    isBuiltIn: false
  },
  {
    name: 'Danza.jpg',
    icon: '/images.png',
    path: '/Danza.jpg',
    isBuiltIn: false
  },
  {
    name: 'Bball_Nerds.jpg',
    icon: '/images.png',
    path: '/Bball_Nerds.jpg',
    isBuiltIn: false
  },
  {
    name: 'Twins.jpg',
    icon: '/images.png',
    path: '/Twins.jpg',
    isBuiltIn: false
  },
  {
    name: 'Spice.jpg',
    icon: '/images.png',
    path: '/Spice.jpg',
    isBuiltIn: false
  },
  {
    name: 'Iconic.jpg',
    icon: '/images.png',
    path: '/Iconic.jpg',
    isBuiltIn: false
  },
  {
    name: 'Uncle_Jesse.jpg',
    icon: '/images.png',
    path: '/Uncle_Jesse.jpg',
    isBuiltIn: false
  },
];