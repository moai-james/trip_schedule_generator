import React, { useEffect } from 'react';

const GoogleCSE: React.FC = () => {
  useEffect(() => {
    // Load the Google CSE script
    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=04e042eb076384151";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div className="gcse-search"></div>;
};

export default GoogleCSE;