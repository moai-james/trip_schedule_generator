import React, { useState } from 'react';
import { Plane } from 'lucide-react';
import TripForm from './components/TripForm';
import ImageSelector from './components/ImageSelector';
import IntroductionEditor from './components/IntroductionEditor';
import InteractiveMap from './components/InteractiveMap';
import { TripData } from './types';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [step, setStep] = useState<'form' | 'images' | 'introductions' | 'map'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = async (data: TripData) => {
    setIsLoading(true);
    setError(null);
    try {
      setTripData(data);
      setStep('images');
    } catch (err) {
      setError(t('errorProcessingTripData'));
      console.error('Error processing trip data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesSelected = (updatedTripData: TripData) => {
    setTripData(updatedTripData);
    setStep('introductions');
  };

  const handleIntroductionsEdited = (updatedTripData: TripData) => {
    setTripData(updatedTripData);
    setStep('map');
  };

  const handleBack = () => {
    switch (step) {
      case 'images':
        setStep('form');
        break;
      case 'introductions':
        setStep('images');
        break;
      case 'map':
        setStep('introductions');
        break;
      default:
        break;
    }
  };

  const jumpToForm = () => {
    setStep('form');
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center cursor-pointer" onClick={jumpToForm}>
          <Plane className="mr-2" /> {t('title')}
        </h1>
        <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      </header>
      <main>
        {isLoading ? (
          <p className="text-center">{t('loading')}</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {step === 'form' && (
              <>
                <p className="mb-4">{t('subtitle')}</p>
                <TripForm onSubmit={handleSubmit} initialData={tripData} />
              </>
            )}
            {step === 'images' && tripData && (
              <ImageSelector tripData={tripData} onImagesSelected={handleImagesSelected} onBack={handleBack} />
            )}
            {step === 'introductions' && tripData && (
              <IntroductionEditor tripData={tripData} onIntroductionsEdited={handleIntroductionsEdited} onBack={handleBack} />
            )}
            {step === 'map' && tripData && (
              <InteractiveMap tripData={tripData} onBack={handleBack} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;