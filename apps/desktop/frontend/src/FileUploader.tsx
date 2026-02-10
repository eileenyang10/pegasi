import React, { useState } from 'react';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      console.log('Uploading file...');

      const formData = new FormData();
      formData.append('file', file);

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        const result = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: "qwen3-vl-4b",
            prompt: "You are a keyword extractor. Extract 8–15 keywords from this document that would help a human quickly index or search it. Prefer specific nouns and noun phrases. Avoid generic words. Return ONLY valid JSON in the exact schema: { \"keywords\": [ { \"term\": string, \"score\": number } ] } where score is 0–1 confidence. No extra text.",
          })
        });

        const data = await result.json();

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="input-group">
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}

      {file && (
        <button 
          onClick={handleUpload}
          className="submit"
        >Upload a file</button>
      )}
    </>
  );
};

export default FileUploader;