import React, { useState } from 'react';

type Status =  'idle' | 'uploading' | 'extracting' | 'done' | 'fail';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [keywords, setKeywords] = useState<String>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus('idle');
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus('extracting');

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch("http://localhost:8000/extract_keywords", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Backend error:", text);
          setStatus('fail');
          return;
        }

        const data = await res.text();
        setKeywords(data);
        setStatus('done');
      } catch (err) {
        console.error("Network / JS error:", err);
        setStatus('fail');
      }
    }
  };

  return (
    <>
      <div className="input-group">
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      {/* {file && (
        <section>
          File details:
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )} */}

      {file && (
        <button 
          onClick={handleUpload}
          className="submit"
        >Upload a file</button>
      )}
      <Result status={status} />
      {keywords && (
        <div>
          {JSON.stringify(keywords)}
        </div>
      )}
    </>
  );
};

const Result = ({ status }: { status: string }) => {
  if (status === 'done') {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === 'fail') {
    return <p>❌ File upload failed!</p>;
  } else if (status === 'uploading') {
    return <p>⏳ Uploading selected file...</p>;
  } else if (status === 'extracting') {
    return <p>⏳ Extracting selected file...</p>;
  } else {
    return null;
  }
};

export default FileUploader;