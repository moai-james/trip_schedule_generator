import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { TripData, LayoutType } from '../types';
import { generateMarkdown } from '../services/pdfGenerator';
import { useLanguage } from '../contexts/LanguageContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFPreviewProps {
  tripData: TripData;
  layout: LayoutType;
  onBack: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ tripData, layout, onBack }) => {
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  const markdown = generateMarkdown(tripData, layout);

  const generatePDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('travel_itinerary.pdf');
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {t('backToForm')}
      </button>
      <button onClick={generatePDF} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        {t('downloadPDF')}
      </button>
      <div ref={contentRef} className="bg-white p-8 rounded shadow-lg">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PDFPreview;