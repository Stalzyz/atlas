"use client";

import React, { useRef } from 'react';
import { useShopifyCalculator } from '@/hooks/useShopifyCalculator';
import { CalculatorInputs } from './CalculatorInputs';
import { CalculatorCharts } from './CalculatorCharts';
import { CalculatorSummary } from './CalculatorSummary';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function ShopifyCostCalculator() {
  const calculator = useShopifyCalculator();
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb' // tailwind gray-50
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('shopify-roi-analysis.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8" ref={exportRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            How Much Does Shopify <span className="text-green-600">Really</span> Cost?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Calculate your yearly Shopify expenses including subscriptions, transaction fees, paid apps, and hidden costs. Compare it directly with owning your own enterprise eCommerce platform.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 relative items-start">
          
          {/* Left Column (Inputs & Charts) */}
          <div className="xl:col-span-8 space-y-8">
            <CalculatorInputs calculator={calculator} />
            <CalculatorCharts calculator={calculator} />
          </div>

          {/* Right Column (Sticky Summary) */}
          <div className="xl:col-span-4">
            <CalculatorSummary 
              calculator={calculator} 
              onExport={handleExportPDF} 
            />
          </div>
          
        </div>

        {/* Disclaimer */}
        <div className="mt-16 text-center text-sm text-gray-400 max-w-4xl mx-auto">
          <p>
            *Results are estimates based on the values you enter. Actual costs vary depending on your specific Shopify plan, negotiated payment provider rates, exact app usage, transaction volume fluctuations, taxes, and third-party services. Review current pricing and consult with a specialist before making business decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
