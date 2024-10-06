import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const translations: Record<Language, Record<string, string>> = {
    en: {
      title: 'AI Travel PDF Generator',
      subtitle: 'Create beautiful travel itineraries with AI',
      addDay: 'Add Day',
      addLocation: 'Add Location',
      removeDay: 'Remove Day',
      removeLocation: 'Remove Location',
      generateItinerary: 'Generate Itinerary',
      back: 'Back',
      loading: 'Loading...',
      errorProcessingTripData: 'An error occurred while processing trip data. Please try again.',
      downloadPDF: 'Download PDF',
      day: 'Day',
      enterLocation: 'Enter a location',
      preview: 'Preview',
      edit: 'Edit',
      selectImages: 'Select Images for Your Trip',
      continueToIntroductions: 'Continue to Introductions',
      editIntroductions: 'Edit Introductions',
      continueToPreview: 'Continue to Preview',
      noImagesFound: 'No images found for {locationName}. Please try a different search term.',
      backToForm: 'Back to Form',
      tryAgain: 'Try Again',
      failedToFetchImages: 'Failed to fetch images. Please try again.',
      searching: 'Searching...',
      searchImages: 'Search Images',
      imagesFor: 'Images for',
      time: 'Time',
      allDays: 'All Days',
    },
    zh: {
      title: 'AI 旅遊行程生成器',
      subtitle: '使用 AI 創建精美的旅遊行程',
      addDay: '新增天數',
      addLocation: '新增地點',
      removeDay: '移除天數',
      removeLocation: '移除地點',
      generateItinerary: '生成行程',
      back: '返回',
      loading: '載入中...',
      errorProcessingTripData: '處理行程資料時發生錯誤。請重試。',
      downloadPDF: '下載 PDF',
      day: '第',
      day_2: '天',
      enterLocation: '輸入地點',
      preview: '預覽',
      edit: '編輯',
      selectImages: '為您的行程選擇圖片',
      continueToIntroductions: '繼續編輯介紹',
      editIntroductions: '編輯介紹',
      continueToPreview: '繼續預覽',
      noImagesFound: '找不到 {locationName} 的圖片。請嘗試不同的搜尋詞。',
      backToForm: '返回表單',
      tryAgain: '重試',
      failedToFetchImages: '獲取圖片失敗。請重試。',
      searching: '搜尋中...',
      searchImages: '搜尋圖片',
      imagesFor: '圖片：',
      time: '時間',
      allDays: '所有天數',
    },
  };

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};