import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TripData, LayoutType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import PDFPreview from './PDFPreview';

interface LayoutSelectionProps {
  tripData: TripData;
  onBack: () => void;
}

const LayoutSelection: React.FC<LayoutSelectionProps> = ({ tripData, onBack }) => {
  const { t } = useLanguage();
  const [selectedLayout, setSelectedLayout] = React.useState<LayoutType | null>(null);

  const handleLayoutSelect = (layout: LayoutType) => {
    setSelectedLayout(layout);
  };

  if (selectedLayout) {
    return <PDFPreview tripData={tripData} layout={selectedLayout} onBack={() => setSelectedLayout(null)} />;
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center text-blue-500 hover:text-blue-700">
        <ArrowLeft className="mr-1" size={16} /> {t('backToForm')}
      </button>
      <h2 className="text-2xl font-bold mb-4">{t('selectLayout')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['modern', 'classic', 'minimalist'] as LayoutType[]).map((layout) => (
          <button
            key={layout}
            onClick={() => handleLayoutSelect(layout)}
            className="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src={`/layouts/${layout}.png`}
              alt={`${layout} layout`}
              className="w-full h-32 object-cover mb-2"
            />
            <span className="font-semibold capitalize">{t(layout)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelection;