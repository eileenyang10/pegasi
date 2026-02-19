import React, { useState } from 'react';

type Status =  'idle' | 'extracting' | 'done' | 'fail';

type Keyword = {
  term: string,
  score: number
}

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus('idle');
      setFile(e.target.files[0]);
      setKeywords([]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setStatus('extracting');
      setKeywords([]);
      console.log('extracting file')

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch("http://localhost:8000/extract_keywords", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        
        console.log(res);
        const data = await res.json();
        const obj = JSON.parse(data);
        console.log(obj.keywords);
        setKeywords(obj.keywords);
        setStatus('done');
      } catch (err) {
        console.error("Network / JS error:", err);
        setStatus('fail');
      }
    }
  };

  const keywordsList = keywords?.map((k,i) => {

    const confidence = Math.round(k.score * 100);
    return <li key={i}> {k.term} ({confidence}%) </li>
  })

  return (
    <>
      <div className="input-group">
        <input id="file" accept="application/pdf" type="file" onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          File Uploaded:
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
          disabled={status === 'extracting'}
        >Extract Keywords</button>
      )}
      <Result status={status} />
      {keywords && keywordsList && (<ul> {keywordsList} </ul>)}
    </>
  );
};

const Result = ({ status }: { status: string }) => {
  if (status === 'done') {
    return <p>✅ Keywords Extracted !</p>;
  } else if (status === 'fail') {
    return <p>❌ File upload failed!</p>;
  } else if (status === 'extracting') {
    return <p>⏳ Extracting words...</p>;
  } else {
    return null;
  }
};

export default FileUploader;