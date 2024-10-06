import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TripData } from '../types';
import { generateMarkdown } from '../services/pdfGenerator';
import { useLanguage } from '../contexts/LanguageContext';

interface MarkdownPreviewEditorProps {
  tripData: TripData;
  onBack: () => void;
}

const MarkdownPreviewEditor: React.FC<MarkdownPreviewEditorProps> = ({ tripData, onBack }) => {
  const { t } = useLanguage();
  const [markdown, setMarkdown] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('MarkdownPreviewEditor: tripData received:', JSON.stringify(tripData, null, 2));
    const generatedMarkdown = generateMarkdown(tripData, 'modern');
    console.log('MarkdownPreviewEditor: Generated markdown:', generatedMarkdown);
    setMarkdown(generatedMarkdown);
  }, [tripData]);

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          {t('back')}
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {isEditing ? t('preview') : t('edit')}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={markdown}
          onChange={handleMarkdownChange}
          className="w-full h-[calc(100vh-150px)] p-4 border rounded font-mono text-sm"
        />
      ) : (
        <div className="bg-white p-8 rounded shadow-lg overflow-auto h-[calc(100vh-150px)]">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4" {...props} />,
              img: ({ node, ...props }) => <img className="w-full max-w-md mx-auto my-4 rounded-lg shadow-md" {...props} />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownPreviewEditor;