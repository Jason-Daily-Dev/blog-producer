import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Title from './components/Title';
import BlogPrompt from './components/BlogPrompt';
import GenerateBlogButton from './components/GenerateBlogButton';
import BlogContentModal from './components/BlogContentModal';
import { usePrompt } from './context/PromptContext';
import { useAuth0 } from '@auth0/auth0-react';
import TopRightUserInfo from './components/TopRightUserInfo';
import { Box, Button, Typography, Container } from '@mui/material';
import AppBackground from './components/AppBackground';

function App() {
  const { contentPrompt } = usePrompt();
  const { loginWithRedirect, logout, getAccessTokenSilently, user, isAuthenticated } = useAuth0();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [blogContent, setBlogContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined); // State for background image URL
  const [blogFormat, setBlogFormat] = useState<string>('html'); // State for background image URL
  const [open, setOpen] = useState(false); // State to control the modal open/close

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setOpen(false); // Close the modal before generating new content
    try {
      const token = await getAccessTokenSilently();
      const requestBody = {
        content_prompt: contentPrompt,
        style: "html", // Specify the format as "html"
      };

      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBlogContent(data.content || '');
      setImageUrl(data.background_image || null); // Set the image URL from the response
      setBlogFormat(data.format || 'html'); // Set the blog format from the response
      setSuccess(true);
      setOpen(true); // Reopen the modal after generating new content
    } catch (error) {
      console.error('Error generating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const LandingPage = () => (
    <Container
      sx={{
        textAlign: 'center',
        padding: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        AI Blog Generator
      </Typography>
      <Typography variant="body1" gutterBottom>
        Create intelligent, image-rich blog posts with a single prompt.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}>
        Log In / Sign Up
      </Button>
    </Container>
  );

  return (
    <Router>
      <AppBackground>
        {isAuthenticated ? (
          <Box
            className="app-container"
            sx={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
            }}
          >
            <TopRightUserInfo />
            <Title />
            <Box
              className="content-wrapper"
              sx={{
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <BlogPrompt />
              <GenerateBlogButton loading={loading} handleSubmit={handleSubmit} />
            </Box>
            {blogContent && (
              <BlogContentModal
                blogContent={blogContent}
                imageUrl={imageUrl}
                blogFormat={blogFormat}
                open={open} // Pass the open state to control modal visibility
                setOpen={setOpen} // Pass the setOpen function to allow modal state updates
                setBlogContent={setBlogContent} // Pass setBlogContent to allow resetting content
                setImageUrl={setImageUrl} // Pass setImageUrl to allow resetting image URL
                setBlogFormat={setBlogFormat} // Pass setBlogFormat to allow resetting blog format
              />
            )}
          </Box>
        ) : (
          <LandingPage />
        )}
      </AppBackground>
    </Router>
  );
}

export default App;
