import React, { useState, useEffect } from 'react';
import { TripData } from '../types';
import { searchImages } from '../services/imageSearch';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ImageSelectorProps {
  tripData: TripData;
  onImagesSelected: (updatedTripData: TripData) => void;
  onBack: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ tripData, onImagesSelected, onBack }) => {
  const { t } = useLanguage();
  const [images, setImages] = useState<{ [key: string]: string[] }>({});
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [tripData]);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedImages = await searchImages(tripData);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(t('failedToFetchImages'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (locationName: string, imageUrl: string) => {
    setSelectedImages({ ...selectedImages, [locationName]: imageUrl });
  };

  const handleSubmit = () => {
    const updatedTripData = {
      ...tripData,
      images: selectedImages,
    };
    onImagesSelected(updatedTripData);
  };

  if (isLoading) {
    return <p className="text-center">{t('loading')}</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchImages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center mx-auto"
        >
          <RefreshCw className="mr-2" size={16} />
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{t('selectImages')}</h2>
      {tripData.days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t('day')} {dayIndex + 1} 天</h3>
          {day.locations.map((location, locationIndex) => (
            <div key={locationIndex} className="mb-4">
              <h4 className="text-lg font-medium mb-2">{location.name}</h4>
              <div className="grid grid-cols-3 gap-4">
                {images[location.name]?.map((imageUrl, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={imageUrl}
                    alt={`${location.name} ${imageIndex + 1}`}
                    className={`w-full h-32 object-cover cursor-pointer ${
                      selectedImages[location.name] === imageUrl ? 'border-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleImageSelect(location.name, imageUrl)}
                  />
                ))}
              </div>
              {!images[location.name] || images[location.name].length === 0 && (
                <p className="text-yellow-600 flex items-center mt-2">
                  <AlertCircle className="mr-2" size={16} />
                  {t('noImagesFound', { locationName: location.name })}
                </p>
              )}
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
          {t('continueToIntroductions')}
        </button>
      </div>
    </div>
  );
};

export default ImageSelector;