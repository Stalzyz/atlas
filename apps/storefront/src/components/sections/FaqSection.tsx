"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  content: {
    headline?: string;
    faqs?: FaqItem[];
  };
}

export function FaqSection({ content }: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const faqs = content.faqs || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {content.headline && (
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-theme-text">
          {content.headline}
        </h2>
      )}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-theme-border rounded-2xl overflow-hidden bg-theme-surface shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              <span className="font-medium text-lg text-theme-text">{faq.question}</span>
              {activeIndex === index ? (
                <ChevronUp className="text-primary w-5 h-5 flex-shrink-0" />
              ) : (
                <ChevronDown className="text-theme-text-muted w-5 h-5 flex-shrink-0" />
              )}
            </button>
            <div 
              className={`px-6 transition-all duration-300 ease-in-out ${
                activeIndex === index ? 'max-h-[500px] py-5 border-t border-theme-border opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <p className="text-theme-text-muted leading-relaxed whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <p className="text-center text-gray-400 italic">No FAQs added yet.</p>
        )}
      </div>
    </div>
  );
}
