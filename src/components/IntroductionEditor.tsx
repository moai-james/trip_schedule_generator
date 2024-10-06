import React, { useState, useEffect } from 'react';
import { TripData } from '../types';
import { generateIntroductions } from '../services/openai';
import { useLanguage } from '../contexts/LanguageContext';

interface IntroductionEditorProps {
  tripData: TripData;
  onIntroductionsEdited: (updatedTripData: TripData) => void;
  onBack: () => void;
}

const IntroductionEditor: React.FC<IntroductionEditorProps> = ({ tripData, onIntroductionsEdited, onBack }) => {
  const { t } = useLanguage();
  const [introductions, setIntroductions] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIntroductions();
  }, [tripData]);

  const fetchIntroductions = async () => {
    setIsLoading(true);
    try {
      const generatedIntroductions = await generateIntroductions(tripData);
      setIntroductions(generatedIntroductions);
    } catch (error) {
      console.error('Error generating introductions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntroductionChange = (locationName: string, value: string) => {
    setIntroductions({ ...introductions, [locationName]: value });
  };

  const handleSubmit = () => {
    const updatedTripData = {
      ...tripData,
      introductions,
    };
    onIntroductionsEdited(updatedTripData);
  };

  if (isLoading) {
    return <p className="text-center">{t('loading')}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{t('editIntroductions')}</h2>
      {tripData.days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t('day')} {dayIndex + 1} 天</h3>
          {day.locations.map((location, locationIndex) => (
            <div key={locationIndex} className="mb-4">
              <h4 className="text-lg font-medium mb-2">{location.name}</h4>
              <textarea
                value={introductions[location.name] || ''}
                onChange={(e) => handleIntroductionChange(location.name, e.target.value)}
                className="w-full h-32 p-2 border rounded"
              />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {t('back')}
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t('continueToPreview')}
        </button>
      </div>
    </div>
  );
};

export default IntroductionEditor;