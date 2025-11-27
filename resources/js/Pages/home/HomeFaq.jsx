import React, { useRef, useState, useEffect } from "react";

// FAQAccordion.jsx
// Single-file React component (default export) that renders an accordion-style FAQ.
// Requirements met:
// - Only one item open at a time (opening an item closes the previously open one).
// - Smooth open/close animations.
// - Accessible (keyboard + aria attributes).
// - Uses Tailwind CSS utility classes for styling (no extra imports required).
// - Uses the uploaded image as a background; path provided below.

// Image path provided by user (will be converted to a URL by the environment):
const BACKGROUND_IMAGE = "/mnt/data/4ca0a727-3423-4df1-88de-068a50a8918d.png";

const FAQ_ITEMS = [
  {
    question: "What is KOUSTUBHA FAST SERVICES?",
    answer:
      "It is a digital platform connecting vehicle owners with verified Partners for on-site servicing and repairs.",
  },
  {
    question: "How does the platform work?",
    answer:
      "Customers request a service, we match them with a verified partner nearby, and the partner comes to the customer's location to perform the requested service.",
  },
  {
    question: "What types of services are available?",
    answer:
      "From routine maintenance to repairs and diagnostics, we support a wide range of vehicle services. Check the service list in the app for details.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Payments are processed securely through our payment gateway. Customers can pay via cards or UPI depending on availability.",
  },
  {
    question: "When do Partners receive their payments?",
    answer:
      "Partners receive payouts after successful completion of the service and after any necessary verification/processes are completed.",
  },
  {
    question: "Are payments safe on this platform?",
    answer: "Yes. We use industry-standard encryption and a trusted payment gateway to secure transactions.",
  },
  {
    question: "How are refunds processed?",
    answer:
      "Refunds are handled case-by-case. If eligible, refunds will be processed to the original payment method within the timeline described in our policy.",
  },
];

export default function HomeFaq({ items = FAQ_ITEMS }) {
  const [openIndex, setOpenIndex] = useState(0); // start with the first item open
  const contentRefs = useRef([]);

  // Ensure refs length matches items
  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, items.length);
  }, [items]);

  // When openIndex changes, set heights for smooth transition
  useEffect(() => {
    items.forEach((_, i) => {
      const el = contentRefs.current[i];
      if (!el) return;

      if (i === openIndex) {
        // set to scrollHeight to expand
        const height = el.scrollHeight;
        el.style.height = height + "px";
      } else {
        // collapse
        el.style.height = "0px";
      }
    });
  }, [openIndex, items]);

  // toggle handler: open clicked index and close others
  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  // keyboard support
  const onKeyDownHeader = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(index);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % items.length;
      document.getElementById(`faq-header-${next}`).focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + items.length) % items.length;
      document.getElementById(`faq-header-${prev}`).focus();
    }
  };

  return (
    <div
      className="  py-6 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24 bg-black text-white"
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-8">
          <h2 className="fading text-white text-3xl lg:text-4xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className='fading text-gray-500 mb-8'>Explore our FAQ section to discover how we've empowered businesses like yours to thrive online.</p>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div  key={idx} className='fading relative p-[1px] mb-4  rounded-[19px] overflow-hidden bg-gradient-to-r from-gray-600 to-gray-800/50'>
               <div  className="rounded-2xl bg-dark rounded-[19px] overflow-hidden">
               <div
                  id={`faq-header-${idx}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-panel-${idx}`}
                  onKeyDown={(e) => onKeyDownHeader(e, idx)}
                  onClick={() => handleToggle(idx)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none bg-gray-900/60"
               >
                  <div className="text-xl font-medium">{item.question}</div>
                  <div className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-gray-600">
                     <svg
                     className={`transform transition-transform duration-300 ${openIndex === idx ? "rotate-45" : "rotate-0"}`}
                     xmlns="http://www.w3.org/2000/svg"
                     width="18"
                     height="18"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     >
                     <line x1="12" y1="5" x2="12" y2="19" />
                     <line x1="5" y1="12" x2="19" y2="12" />
                     </svg>
                  </div>
               </div>
               <div
                  id={`faq-panel-${idx}`}
                  ref={(el) => (contentRefs.current[idx] = el)}
                  className="px-4 overflow-hidden bg-gray-900/40 transition-all duration-300"
                  style={{ height: idx === openIndex ? undefined : "0px" }}
                  aria-hidden={openIndex !== idx}
               >
                  <div className="py-4 text-gray-300">{item.answer}</div>
               </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
