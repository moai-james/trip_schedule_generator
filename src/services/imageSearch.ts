import { TripData } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

export const searchImages = async (tripData: TripData): Promise<{ [key: string]: string[] }> => {
  const images: { [key: string]: string[] } = {};

  for (const day of tripData.days) {
    for (const location of day.locations) {
      try {
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(location.name)}&searchType=image&num=9`;
        console.log(`Fetching images for ${location.name} with URL:`, url);

        const response = await fetch(url);
        const data = await response.json();

        console.log(`API Response for ${location.name}:`, JSON.stringify(data, null, 2));

        if (data.items && data.items.length > 0) {
          images[location.name] = data.items.map((item: any) => item.link);
          console.log(`Found ${images[location.name].length} images for ${location.name}`);
        } else {
          console.warn(`No images found for ${location.name}`);
          images[location.name] = [];
        }

        if (data.error) {
          console.error(`API Error for ${location.name}:`, data.error);
        }

        if (data.searchInformation) {
          console.log(`Search Information for ${location.name}:`, data.searchInformation);
        }
      } catch (error) {
        console.error(`Error fetching images for ${location.name}:`, error);
        images[location.name] = [];
      }
    }
  }

  return images;
};