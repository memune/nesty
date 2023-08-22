import React, { useState } from 'react';
import axios from 'axios';

function MetadataPage() {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(`/api/get-metadata?url=${url}`);
      setMetadata(response.data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Metadata Fetcher</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Get Metadata</button>
      </form>

      <h3>Metadata:</h3>
      <pre>{JSON.stringify(metadata, null, 2)}</pre>
    </div>
  );
}

export default MetadataPage;
