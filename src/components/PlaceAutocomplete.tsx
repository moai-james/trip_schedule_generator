import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string, placeId: string) => void;
  className?: string;
}

const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({ value, onChange, className }) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['place_id', 'name', 'types']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.name && place.place_id) {
          onChange(place.name, place.place_id);
        }
      });
    }
  }, [onChange]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center border rounded">
        <MapPin className="ml-2 text-gray-400" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value, '')}
          className="p-2 w-full"
          placeholder={t('enterLocation')}
        />
      </div>
    </div>
  );
};

export default PlaceAutocomplete;