'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      question: 'How long does it take?',
      answer: 'Usually 25–35 working days, depending on project requirements, features needed, and the complexity of the design.'
    },
    {
      question: 'Can I manage the website myself?',
      answer: 'Yes! We build user-friendly platforms and provide comprehensive training after launch so you can easily manage products, orders, and content.'
    },
    {
      question: 'Can I add products later?',
      answer: 'Absolutely. You can add unlimited products anytime. The platforms are designed to grow with your business.'
    },
    {
      question: 'Do you provide hosting?',
      answer: 'Yes. We can help you choose the right hosting plan based on your business size, expected traffic, and budget.'
    },
    {
      question: 'Can you redesign my existing website?',
      answer: 'Yes. We can migrate your data from an old platform and redesign your store to improve conversion rates and modern aesthetics.'
    },
    {
      question: 'Do you provide SEO?',
      answer: 'Yes. Every website includes basic SEO setup. We also offer advanced SEO packages for businesses looking to dominate search engine rankings.'
    },
    {
      question: 'Do you provide maintenance?',
      answer: 'Yes. Annual Maintenance Plans (AMC) are available for updates, backups, security, and technical support to keep your store running smoothly.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">
                  {faq.question}
                </h3>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'}`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
