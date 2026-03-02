
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
    const phoneNumber = '+2349155277239';
    const message = 'Hello! I would like to make an inquiry.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
            aria-label="Contact on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-black text-xs uppercase tracking-widest whitespace-nowrap">
                Chat with us
            </span>
        </a>
    );
};

export default WhatsAppButton;
