'use client';
import { motion } from 'framer-motion';
import { MessageSquare, FileLineChart, PenTool, Code, CheckCircle, Rocket, GraduationCap } from 'lucide-react';

export default function DevelopmentProcess() {
  const steps = [
    {
      title: 'Business Discussion',
      description: 'We understand your products, customers, and business goals.',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Planning',
      description: 'We outline website structure, pages, categories, and features.',
      icon: <FileLineChart className="w-6 h-6" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful layouts, easy shopping experience, and mobile-first design.',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Development',
      description: 'Building a fast, secure, and SEO-ready storefront.',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      title: 'Testing',
      description: 'Payment, checkout, mobile responsiveness, speed, and orders are rigorously tested.',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-emerald-500'
    },
    {
      title: 'Launch',
      description: 'Website goes live and is ready to accept orders.',
      icon: <Rocket className="w-6 h-6" />,
      color: 'bg-amber-500'
    },
    {
      title: 'Training',
      description: 'We teach you how to add products, manage orders, update banners, and track sales.',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'bg-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Our Development Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            A streamlined approach to getting your business online.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 z-0" />

          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={`flex-1 w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm
                  ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}
                `}>
                  <div className="text-sm font-bold text-slate-400 mb-2">STEP {index + 1}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center shrink-0 z-10 shadow-lg ${step.color} relative md:-mx-6`}>
                  {step.icon}
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
