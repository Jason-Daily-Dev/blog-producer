import React, { useState } from 'react';
import Title from './components/Title';
import BlogPrompt from './components/BlogPrompt';
import UploadFilesDialog from './components/UploadFilesDialog';
import GenerateBlogButton from './components/GenerateBlogButton';
import BlogContent from './components/BlogContent';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [blogContent, setBlogContent] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!prompt) return;

    setLoading(true);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      images.forEach((image) => formData.append('images', image));

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setBlogContent(data.content || '');
      setSuccess(true);
    } catch (error) {
      console.error('Error generating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Title />
      <div className="content-wrapper" style={{ width: '100%', textAlign: 'center' }}>
        <BlogPrompt prompt={prompt} setPrompt={setPrompt} />
        <UploadFilesDialog handleFileChange={handleFileChange} />
        <GenerateBlogButton loading={loading} handleSubmit={handleSubmit} disabled={loading || !prompt} />
      </div>
      {blogContent && <BlogContent blogContent={blogContent} />}
    </div>
  );
}

export default App;
