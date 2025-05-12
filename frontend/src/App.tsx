import React, { useState } from 'react';
import Title from './components/Title';
import BlogPrompt from './components/BlogPrompt';
import GenerateBlogButton from './components/GenerateBlogButton';
import BlogContent from './components/BlogContent';
import { usePrompt } from './context/PromptContext';

function App() {
  const { contentPrompt, imagePrompt } = usePrompt();

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
    setLoading(true);
    setSuccess(false);
    try {
      const requestBody = {
        content_prompt: contentPrompt,
        image_prompt: imagePrompt,
      };

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
          <BlogPrompt />
          <GenerateBlogButton loading={loading} handleSubmit={handleSubmit} />
        </div>
        {blogContent && <BlogContent blogContent={blogContent} />}
      </div>
  );
}

export default App;
