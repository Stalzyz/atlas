'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw } from 'lucide-react';

type Question = {
  id: string;
  question: string;
  options: { label: string; score: { shopify: number; woocommerce: number; atlas: number } }[];
};

export default function InteractivePlatformFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ shopify: 0, woocommerce: 0, atlas: 0 });
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 'q1',
      question: 'What is your current business stage?',
      options: [
        { label: "I'm just starting out / Startup", score: { shopify: 3, woocommerce: 1, atlas: 0 } },
        { label: 'Growing business looking to scale', score: { shopify: 1, woocommerce: 2, atlas: 3 } },
        { label: 'Established brand with high volume', score: { shopify: 0, woocommerce: 1, atlas: 4 } },
      ],
    },
    {
      id: 'q2',
      question: 'How important is complete ownership of your store data?',
      options: [
        { label: 'Not very. I just want it to work easily.', score: { shopify: 3, woocommerce: 0, atlas: 0 } },
        { label: 'Important. I prefer self-hosted solutions.', score: { shopify: 0, woocommerce: 3, atlas: 2 } },
        { label: 'Critical. I need full ownership and custom features.', score: { shopify: 0, woocommerce: 2, atlas: 4 } },
      ],
    },
    {
      id: 'q3',
      question: 'Do you need advanced features like Multi-Vendor or built-in CRM?',
      options: [
        { label: 'No, just a simple store to sell my products.', score: { shopify: 3, woocommerce: 1, atlas: 0 } },
        { label: 'Maybe later via plugins/apps.', score: { shopify: 1, woocommerce: 3, atlas: 1 } },
        { label: 'Yes, absolutely essential for my business.', score: { shopify: 0, woocommerce: 0, atlas: 5 } },
      ],
    },
  ];

  const handleOptionSelect = (score: { shopify: number; woocommerce: number; atlas: number }) => {
    setScores(prev => ({
      shopify: prev.shopify + score.shopify,
      woocommerce: prev.woocommerce + score.woocommerce,
      atlas: prev.atlas + score.atlas,
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({ shopify: 0, woocommerce: 0, atlas: 0 });
    setShowResult(false);
  };

  const getWinner = () => {
    if (scores.atlas > scores.shopify && scores.atlas > scores.woocommerce) return 'Atlas CMS';
    if (scores.shopify > scores.woocommerce) return 'Shopify';
    return 'WooCommerce';
  };

  const getWinnerDetails = () => {
    const winner = getWinner();
    if (winner === 'Atlas CMS') return { title: 'Atlas CMS', color: 'text-blue-600', bg: 'bg-blue-50', desc: "Grekam Visuals' enterprise-grade platform is perfect for your scaling needs, giving you full ownership and advanced features without plugin bloat." };
    if (winner === 'Shopify') return { title: 'Shopify', color: 'text-[#95bf47]', bg: 'bg-[#95bf47]/10', desc: "You need a fast, reliable, and hassle-free solution. Shopify is the perfect choice for getting your store up and running quickly." };
    return { title: 'WooCommerce', color: 'text-[#7F54B3]', bg: 'bg-[#7F54B3]/10', desc: "You value flexibility and complete ownership while keeping initial costs lower. WooCommerce on WordPress is the ideal fit." };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 h-full flex flex-col">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Platform Finder Quiz</h3>
        <p className="text-slate-500 dark:text-slate-400">Answer 3 simple questions to find the best platform for your needs.</p>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <div className="mb-6">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-2 block">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <h4 className="text-xl font-medium text-slate-800 dark:text-slate-200">
                  {questions[currentStep].question}
                </h4>
              </div>

              <div className="space-y-3 flex-1">
                {questions[currentStep].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(option.score)}
                    className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex justify-between items-center group"
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{option.label}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full items-center justify-center text-center"
            >
              <div className="mb-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-sm">Best Match</span>
              </div>
              
              <div className={`w-full p-6 rounded-2xl ${getWinnerDetails().bg} mb-6`}>
                <h4 className={`text-4xl font-extrabold mb-4 ${getWinnerDetails().color}`}>
                  {getWinnerDetails().title}
                </h4>
                <p className="text-slate-700 dark:text-slate-300">
                  {getWinnerDetails().desc}
                </p>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={resetQuiz}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <a 
                  href="https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20completed%20the%20platform%20quiz%20on%20your%20website%20and%20would%20like%20a%20quote." 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex justify-center items-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium text-center"
                >
                  Get Quote on WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {!showResult && (
        <div className="mt-8">
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
