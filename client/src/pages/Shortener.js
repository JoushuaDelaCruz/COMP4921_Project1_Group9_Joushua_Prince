import React, { useState } from 'react';

const URLShortener = () => {
  const [originalURL, setOriginalURL] = useState('');
  const [shortenedURL, setShortenedURL] = useState('');

  const handleURLShorten = async () => {
    try {
      // Add your URL shortening logic here
      // Send a request to your backend API to shorten the URL

      // Once you get the shortened URL from the server, update the state
      setShortenedURL(/* shortened URL from the server */);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <div>
        <input
          type="text"
          placeholder="Enter URL"
          value={originalURL}
          onChange={(e) => setOriginalURL(e.target.value)}
        />
        <button onClick={handleURLShorten}>Shorten</button>
      </div>
      {shortenedURL && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortenedURL} target="_blank" rel="noopener noreferrer">
            {shortenedURL}
          </a>
        </div>
      )}
    </div>
  );
};

export default URLShortener;
