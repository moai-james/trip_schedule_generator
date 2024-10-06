import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { searchImages } from '../services/imageSearch';

interface ImageSearchProps {
  locationName: string;
  onImageSelect: (locationName: string, imageUrl: string) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ locationName, onImageSelect }) => {
  const { t } = useLanguage();
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const images = await searchImages({ days: [{ locations: [{ name: locationName, time: '' }] }] });
      setSearchResults(images[locationName] || []);
    } catch (error) {
      console.error('Error searching images:', error);
    }
    setIsSearching(false);
  };

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">{t('imagesFor')} {locationName}</h3>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
        disabled={isSearching}
      >
        {isSearching ? t('searching') : t('searchImages')}
      </button>
      <div className="grid grid-cols-3 gap-4">
        {searchResults.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`${locationName} ${index + 1}`}
            className="w-full h-32 object-cover cursor-pointer"
            onClick={() => onImageSelect(locationName, imageUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSearch;