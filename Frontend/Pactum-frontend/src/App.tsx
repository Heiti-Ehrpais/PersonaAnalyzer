import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList';
import MessageList from './components/MessageList';
import SendMessage from './components/SendMessage';
import FileUpload from './components/FileUpload';
import useMessages from './hooks/useMessages';
import { fetchMessages, sendMessage } from './services/api';
import {
  PROVEN_SUCCESS_PROMPT,
  INVENTORY_MANAGEMENT_PROMPT,
  COMPETITIVE_PRICING_PROMPT,
  QUALITY_PRODUCTS_PROMPT,
  LEGAL_COMPLIANCE_PROMPT,
  ETHICAL_SUSTAINABILITY_PROMPT,
  INSURANCE_REQUIREMENTS_PROMPT,
  AUDITS_CERTIFICATIONS_PROMPT,
} from './hooks/PersonaPrompts';

interface Persona {
  key: string;
  label: string;
  template: string;
}

const App: React.FC = () => {
  const selectedUserId = 1;
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { messages, loading, error, setMessages } = useMessages(selectedChatId ?? 0);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [showFileUpload, setShowFileUpload] = useState<boolean>(true);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [personaTemplate, setPersonaTemplate] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(true);

  const personas: Persona[] = [
    { key: 'proven_success', label: 'Proven Success', template: PROVEN_SUCCESS_PROMPT },
    { key: 'inventory_management', label: 'Inventory Management', template: INVENTORY_MANAGEMENT_PROMPT },
    { key: 'competitive_pricing', label: 'Competitive Pricing', template: COMPETITIVE_PRICING_PROMPT },
    { key: 'quality_products', label: 'Quality Products', template: QUALITY_PRODUCTS_PROMPT },
    { key: 'legal_compliance', label: 'Legal Compliance', template: LEGAL_COMPLIANCE_PROMPT },
    { key: 'ethical_sustainability', label: 'Ethical Sustainability', template: ETHICAL_SUSTAINABILITY_PROMPT },
    { key: 'insurance_requirements', label: 'Insurance Requirements', template: INSURANCE_REQUIREMENTS_PROMPT },
    { key: 'audits_certifications', label: 'Audits & Certifications', template: AUDITS_CERTIFICATIONS_PROMPT },
  ];

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    setShowPopup(false);
  };

  const handleMessageSent = async () => {
    if (selectedChatId) {
      const messages = await fetchMessages(selectedChatId);
      setMessages(Array.isArray(messages) ? messages : []);
    }
  };

  const handleUploadSuccess = (data: unknown) => {
    setUploadMessage('File uploaded successfully');
    setShowFileUpload(false);
    console.log(data);
  };

  const handleSelectPersona = async (persona: string, template: string) => {
    if (!selectedChatId) {
      console.error('No chat selected');
      return;
    }
    setSelectedPersona(persona);
    setPersonaTemplate(template);
    try {
      await sendMessage(selectedChatId, { senderId: selectedUserId, message: "persona" + persona });
      console.log(`Persona set to ${persona}`);
    } catch (error) {
      console.error('Failed to set persona:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[300px] border-r p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ChatList onSelectChat={handleSelectChat} />
      </div>
      <div className="w-[1000px] p-4 pl-20 flex-grow">
        {selectedChatId && !showFileUpload ? (
          <>
            <div className="mb-4">
              <MessageList messages={messages} loading={loading} error={error} />
            </div>
            <SendMessage chatId={selectedChatId} senderId={selectedUserId} onMessageSent={handleMessageSent} />
          </>
        ) : (
          <div>Select a chat to view messages</div>
        )}
        <div className="mt-4">
          {showFileUpload ? (
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <div className="w-[300px] border-l p-4">
        <h2 className="text-xl font-bold mb-4">Select Persona</h2>
        <div className="flex flex-col space-y-2">
          {personas.map((persona) => (
            <button
              key={persona.key}
              onClick={() => handleSelectPersona(persona.key, persona.template)}
              className={`p-2 text-white rounded-lg ${
                selectedPersona === persona.key ? 'bg-blue-500' : 'bg-gray-600'
              } hover:bg-blue-700`}
            >
              {persona.label}
            </button>
          ))}
        </div>
        {personaTemplate && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Template:</h3>
            <pre className="whitespace-pre-wrap">{personaTemplate}</pre>
          </div>
        )}
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Select Chat</h2>
            <ChatList onSelectChat={handleSelectChat} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
