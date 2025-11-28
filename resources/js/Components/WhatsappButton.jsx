import React from "react";
import { FaWhatsapp } from "react-icons/fa";
const WhatsAppButton = () => {
    const phone = "918747998747";
    const encodedMessage = encodeURIComponent("Hi there, I would like to request for service, can you help me out?!");
    const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;
    return (
        <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="fixed right-5 bottom-5 z-50 flex items-center md:space-x-3 bg-green-600 hover:bg-green-700 text-white px-2 py-2 md:px-5 md:py-5 rounded-full shadow-lg"
        >
            <span className="hidden sm:inline-block text-sm font-medium">Chat with us</span>
            <FaWhatsapp size={32} />
        </a>
    );
};

export default WhatsAppButton;
