import React, { useState, useEffect } from 'react';
import { Plus, Minus, MapPin } from 'lucide-react';
import { TripData, TripDay, TripLocation } from '../types';
import PlaceAutocomplete from './PlaceAutocomplete';
import { useLanguage } from '../contexts/LanguageContext';

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  initialData: TripData | null;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, initialData }) => {
  const [days, setDays] = useState<TripDay[]>([{ locations: [{ name: '', time: '08:00', placeId: '' }] }]);
  const { t } = useLanguage();

  useEffect(() => {
    if (initialData && initialData.days) {
      setDays(initialData.days);
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ days });
  };

  const addDay = () => {
    setDays([...days, { locations: [{ name: '', time: '08:00', placeId: '' }] }]);
  };

  const removeDay = (dayIndex: number) => {
    setDays(days.filter((_, index) => index !== dayIndex));
  };

  const addLocation = (dayIndex: number) => {
    const newDays = [...days];
    const lastLocation = newDays[dayIndex].locations[newDays[dayIndex].locations.length - 1];
    let newTime = '08:00';
    if (lastLocation && lastLocation.time) {
      const [hours, minutes] = lastLocation.time.split(':').map(Number);
      const newHours = (hours + 1) % 24;
      newTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    newDays[dayIndex].locations.push({ name: '', time: newTime, placeId: '' });
    setDays(newDays);
  };

  const removeLocation = (dayIndex: number, locationIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].locations = newDays[dayIndex].locations.filter((_, index) => index !== locationIndex);
    setDays(newDays);
  };

  const handleLocationChange = (dayIndex: number, locationIndex: number, field: keyof TripLocation, value: string) => {
    const newDays = [...days];
    newDays[dayIndex].locations[locationIndex][field] = value;
    setDays(newDays);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">{t('day')} {dayIndex + 1} {t('day_2')} </h3>
          {day.locations.map((location, locationIndex) => (
            <div key={locationIndex} className="flex items-center space-x-2 mb-2">
              <PlaceAutocomplete
                value={location.name}
                onChange={(value, placeId) => {
                  handleLocationChange(dayIndex, locationIndex, 'name', value);
                  handleLocationChange(dayIndex, locationIndex, 'placeId', placeId);
                }}
                className="flex-grow"
              />
              <input
                type="time"
                value={location.time}
                onChange={(e) => handleLocationChange(dayIndex, locationIndex, 'time', e.target.value)}
                className="border p-2 rounded"
              />
              <button
                type="button"
                onClick={() => removeLocation(dayIndex, locationIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <Minus size={20} />
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => addLocation(dayIndex)}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <Plus size={20} className="mr-1" /> {t('addLocation')}
            </button>
            {days.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <Minus size={20} className="mr-1" /> {t('removeDay')}
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={addDay}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {t('addDay')}
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {t('generateItinerary')}
        </button>
      </div>
    </form>
  );
};

export default TripForm;