// import React from "react";
// import { useState } from "react";
// import axios from 'axios';

// const URLShortener = () => {
//   const [originalURL, setOriginalURL] = useState('');
//   const [shortenedURL, setShortenedURL] = useState('');


//   const handleURLShorten = async () => {
//     try {
//       // Send the originalURL in the POST request body
//       const response = await axios.post('/api/shortenURL', {
//          originalURL,
//       });

//       // Assuming the server responds with a shortened URL
//       const { shortenedURL: newShortenedURL } = response.data;

//       // Update the state with the shortened URL
//       setShortenedURL(newShortenedURL);
//     } catch (error) {
//       console.error('Error while creating user:', error);
//       // Handle any unexpected errors here
//     }
//   };

//   return (
//     <div>
//       <h2>URL Shortener</h2>
//       <div>
//         <input
//           type="text"
//           placeholder="Enter URL"
//           value={originalURL} // Bind the input value to the originalURL state
//           onChange={(e) => setOriginalURL(e.target.value)}
//         />
//         <button onClick={handleURLShorten}>Shorten</button>
//       </div>
//       {shortenedURL && (
//         <div>
//           <p>Shortened URL:</p>
//           <a href={shortenedURL} target="_blank" rel="noopener noreferrer">
//             {shortenedURL}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default URLShortener;
import React, { useState } from "react";
import axios from 'axios';

const URLShortener = () => {
  const [originalURL, setOriginalURL] = useState('');
  const [shortenedURL, setShortenedURL] = useState('');

  const handleURLShorten = async () => {
    try {
      // Send the originalURL in the POST request body
      const response = await axios.post('/api/shortenURL', {
        originalURL,
      });

      // Assuming the server responds with a shortened URL
      const { data } = response;
      const newShortenedURL = data.shortURL;
      
      // Update the state with the shortened URL
      setShortenedURL(newShortenedURL);
    } catch (error) {
      console.error('Error while shortening URL:', error);
      // Handle any unexpected errors here
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <div>
        <input
          type="text"
          placeholder="Enter URL"
          value={originalURL} // Bind the input value to the originalURL state
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
