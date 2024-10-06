import { TripData } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateIntroductions = async (tripData: TripData): Promise<{ [key: string]: string }> => {
  const introductions: { [key: string]: string } = {};

  try {
    for (const day of tripData.days) {
      for (const location of day.locations) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a helpful assistant that generates brief travel introductions in Traditional Chinese."
            }, {
              role: "user",
              content: `請用繁體中文為${location.name}寫一個簡短的旅遊介紹，大約50-100字。`
            }],
            max_tokens: 200
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        introductions[location.name] = data.choices[0].message.content.trim();
      }
    }
  } catch (error) {
    console.error('Error generating introductions:', error);
  }

  return introductions;
};