import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContactsHeader from './ContactsHeader';

interface ContactsAppProps {
  onClose: () => void;
}

interface Contact {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  initial: string;
}

// Flash Forward staff contacts
const flashForwardContacts: Contact[] = [
  { 
    id: 1, 
    name: 'Nick Mitreski', 
    company: 'Flash Forward Digital',
    position: 'Founder & Supreme Overlord',
    email: 'nick@flashforwarddigital.com',
    phone: '(555) 123-4567',
    initial: 'N' 
  },
  { 
    id: 2, 
    name: 'George Gendy', 
    company: 'Flash Forward Digital',
    position: 'Professional Coffee Consumer',
    email: 'george@flashforwarddigital.com',
    phone: '(555) 234-5678',
    initial: 'G' 
  },
  { 
    id: 3, 
    name: 'Alex Chen', 
    company: 'Flash Forward Digital',
    position: 'Chief of "Let AI Handle It"',
    email: 'alex@flashforwarddigital.com',
    phone: '(555) 345-6789',
    initial: 'A' 
  },
  { 
    id: 4, 
    name: 'Sarah Michaels', 
    company: 'Flash Forward Digital',
    position: 'Head of Lights, Camera, Panic',
    email: 'sarah@flashforwarddigital.com',
    phone: '(555) 456-7890',
    initial: 'S' 
  },
  { 
    id: 5, 
    name: 'David Tucker', 
    company: 'Flash Forward Digital',
    position: 'Brand Stylist & Creative Therapist',
    email: 'david@flashforwarddigital.com',
    phone: '(555) 567-8901',
    initial: 'D' 
  },
  { 
    id: 6, 
    name: 'Cooper', 
    company: 'Flash Forward Digital',
    position: 'Emotional Support',
    email: 'cooper@flashforwarddigital.com',
    phone: '(555) 678-9012',
    initial: 'C' 
  },
];

const ContactsApp: React.FC<ContactsAppProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = flashForwardContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedContacts = filteredContacts.reduce((groups, contact) => {
    const initial = contact.initial;
    if (!groups[initial]) {
      groups[initial] = [];
    }
    groups[initial].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);

  return (
    <div className="w-full h-full bg-black flex flex-col">
      <ContactsHeader onClose={onClose} />
      
      <div className="flex-1 bg-white flex flex-col min-h-0">
        {/* Search Bar */}
        <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-gray-50">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Contacts List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(groupedContacts).sort().map((initial) => (
            <div key={initial}>
              {/* Section Header */}
              <div className="sticky top-0 px-4 py-2 bg-gray-100 border-b border-gray-200 z-10">
                <span className="text-gray-600 font-semibold text-sm">{initial}</span>
              </div>
              
              {/* Contacts in this section */}
              {groupedContacts[initial].map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  onClick={() => setSelectedContact(contact)}
                  className="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer active:bg-gray-100"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0">
                    {contact.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{contact.name}</div>
                    <div className="text-xs text-gray-500 truncate">{contact.position}</div>
                    <div className="text-xs text-gray-400 truncate">{contact.company}</div>
                  </div>
                  <div className="text-gray-400 text-lg ml-2">›</div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Contact Detail Modal */}
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-3">
                  {selectedContact.initial}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedContact.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedContact.position}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedContact.company}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16 flex-shrink-0">Phone:</span>
                  <span className="text-blue-600 text-sm">{selectedContact.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm w-16 flex-shrink-0">Email:</span>
                  <span className="text-blue-600 text-sm break-all">{selectedContact.email}</span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedContact(null)}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactsApp; 