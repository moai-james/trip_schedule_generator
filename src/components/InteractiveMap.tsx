import React, { useEffect, useRef, useState } from 'react';
import { TripData, TripLocation } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InteractiveMapProps {
  tripData: TripData;
  onBack: () => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ tripData, onBack }) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<TripLocation | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const google = window.google;
    const map = new google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: 0, lng: 0 },
    });

    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();
    const newDirectionsRenderer = new google.maps.DirectionsRenderer({ map });
    setDirectionsRenderer(newDirectionsRenderer);

    const markers: google.maps.Marker[] = [];

    tripData.days.forEach((day, dayIndex) => {
      day.locations.forEach((location, locationIndex) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId: location.placeId }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const position = results[0].geometry.location;
            const marker = new google.maps.Marker({
              map,
              position,
              title: location.name,
              label: `${dayIndex + 1}-${locationIndex + 1}`,
            });

            bounds.extend(position);
            map.fitBounds(bounds);

            marker.addListener('click', () => {
              setSelectedLocation(location);
              infoWindow.setContent(`<h3>${location.name}</h3><p>${t('day')} ${dayIndex + 1} ${t('day_2')}, ${t('time')}: ${location.time}</p>`);
              infoWindow.open(map, marker);
            });

            markers.push(marker);
          }
        });
      });
    });

    // Filter markers based on selected day
    const filterMarkers = (day: number | null) => {
      markers.forEach((marker, index) => {
        const markerDay = parseInt(marker.getLabel()!.split('-')[0]);
        marker.setVisible(day === null || markerDay === day);
      });
    };

    // Initial filter
    filterMarkers(selectedDay);

    // Update filter when selectedDay changes
    return () => {
      filterMarkers(selectedDay);
    };
  }, [tripData, t, selectedDay]);

  useEffect(() => {
    if (selectedDay !== null && directionsRenderer) {
      const directionsService = new google.maps.DirectionsService();
      const dayLocations = tripData.days[selectedDay - 1].locations;

      if (dayLocations.length < 2) return;

      const origin = dayLocations[0];
      const destination = dayLocations[dayLocations.length - 1];
      const waypoints = dayLocations.slice(1, -1).map(location => ({
        location: { placeId: location.placeId },
        stopover: true
      }));

      directionsService.route(
        {
          origin: { placeId: origin.placeId },
          destination: { placeId: destination.placeId },
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    } else if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
  }, [selectedDay, tripData, directionsRenderer]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {t('back')}
        </button>
        <select
          value={selectedDay || ''}
          onChange={(e) => setSelectedDay(e.target.value ? Number(e.target.value) : null)}
          className="border rounded px-2 py-1"
        >
          <option value="">{t('allDays')}</option>
          {tripData.days.map((_, index) => (
            <option key={index} value={index + 1}>
              {t('day')} {index + 1} {t('day_2')}
            </option>
          ))}
        </select>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
      {selectedLocation && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-semibold mb-2">{selectedLocation.name}</h3>
          <p className="mb-2">{t('time')}: {selectedLocation.time}</p>
          {tripData.images && tripData.images[selectedLocation.name] && (
            <img
              src={tripData.images[selectedLocation.name]}
              alt={selectedLocation.name}
              className="w-full max-w-md mx-auto mb-4 rounded"
            />
          )}
          {tripData.introductions && tripData.introductions[selectedLocation.name] && (
            <p>{tripData.introductions[selectedLocation.name]}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;