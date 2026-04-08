
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
    const phoneNumber = '+2349155277239';
    const message = 'Hello! I would like to make an inquiry.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    const tiktokUrl = 'https://www.tiktok.com/@gohardrepublic';
    const snapchatUrl = 'https://snapchat.com/t/oKbuEh5Y';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-black text-xs uppercase tracking-widest whitespace-nowrap">
                    WhatsApp
                </span>
            </a>

            <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group border border-white/10"
                aria-label="Visit TikTok"
            >
                <svg className="w-6 h-6" viewBox="0 0 256 256" aria-hidden>
                    <path
                        fill="currentColor"
                        d="M184 92a52.06 52.06 0 0 1-36-14.53V170a58 58 0 1 1-46-56.74V144a26 26 0 1 0 20 25.2V48h26.15A52 52 0 0 0 184 92Z"
                    />
                </svg>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-black text-xs uppercase tracking-widest whitespace-nowrap">
                    TikTok
                </span>
            </a>

            <a
                href={snapchatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFFC00] text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
                aria-label="Visit Snapchat"
            >
                <svg className="w-6 h-6" viewBox="0 0 256 256" aria-hidden>
                    <path
                        fill="currentColor"
                        d="M128 24c-27.6 0-50 22.4-50 50v31.7c0 6.2-5.1 11.3-11.3 11.3H56a8 8 0 0 0-2.2 15.7c10.2 2.9 19.1 10.2 19.1 20.3 0 6.5-4.6 12.4-12.1 15.4l-12.2 4.9a8 8 0 0 0 1.6 15.2l13.8 2.7c7.3 1.4 13.3 6.3 16 13.2l3.5 9.1a8 8 0 0 0 7.5 5.1h10.2c7.2 0 14.2 2.6 19.6 7.4l6.8 6a8 8 0 0 0 10.6 0l6.8-6c5.4-4.8 12.4-7.4 19.6-7.4h10.2a8 8 0 0 0 7.5-5.1l3.5-9.1c2.7-6.9 8.7-11.8 16-13.2l13.8-2.7a8 8 0 0 0 1.6-15.2l-12.2-4.9c-7.5-3-12.1-8.9-12.1-15.4 0-10.1 8.9-17.4 19.1-20.3A8 8 0 0 0 200 117h-10.7c-6.2 0-11.3-5.1-11.3-11.3V74c0-27.6-22.4-50-50-50Z"
                    />
                </svg>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-black text-xs uppercase tracking-widest whitespace-nowrap">
                    Snapchat
                </span>
            </a>
        </div>
    );
};

export default WhatsAppButton;
