import React, { useState } from 'react';
import { Box, Modal, IconButton, Typography, Slider, TextField } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandIcon from '@mui/icons-material/Expand';
import DeleteIcon from '@mui/icons-material/Delete';

interface BlogContentModalProps {
  blogContent: string;
  imageUrl?: string;
  blogFormat: string;
  setBlogContent: (content: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setImageUrl: (url: string | undefined) => void;
  setBlogFormat: (format: string) => void;
}

const BlogContentModal: React.FC<BlogContentModalProps> = ({ blogContent,setBlogContent, imageUrl, blogFormat, open, setOpen, setBlogFormat, setImageUrl }) => {
  const [minimized, setMinimized] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.7);
  const [textColor, setTextColor] = useState('#333');

  const handleClose = () => setOpen(false);
  const handleMinimize = () => setMinimized(!minimized);

  const handleBackgroundOpacityChange = (e: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      setBackgroundOpacity(value);
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  };

  const handleReset = () => {
    setOpen(false);
    setMinimized(false);
    setBackgroundOpacity(0.5);
    setTextColor('#333');
    setBlogContent(''); // Clear the blog content
    setImageUrl(undefined); // Clear the image URL
    setBlogFormat('html'); // Reset the blog format
  };

  // Remove embedded images from the blog content
  const sanitizedBlogContent = blogContent.replace(/<img[^>]*>/g, ''); // Strip out <img> tags

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: minimized ? '90%' : '10%',
          left: '50%',
          transform: 'translate(-50%, -10%)',
          width: minimized ? '300px' : '80%',
          height: minimized ? '50px' : '80%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {minimized ? (
          <Box
            sx={{
              backgroundColor: '#F3F4F6',
              color: '#1F2937',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Typography variant="body1">Generated Blog</Typography>
            <IconButton onClick={handleMinimize}>
              <ExpandIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd',
              }}
            >
              <Typography variant="h6">Generated Blog</Typography>
              <Box>
                <IconButton onClick={handleMinimize}>
                  <MinimizeIcon />
                </IconButton>
                <IconButton onClick={handleReset}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f9f9f9',
                borderBottom: '1px solid #ddd',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Background Transparency:</Typography>
                <Slider
                  value={backgroundOpacity}
                  onChange={handleBackgroundOpacityChange}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={{ width: '150px' }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Text Color:</Typography>
                <TextField
                  type="color"
                  value={textColor}
                  onChange={handleTextColorChange}
                  size="small"
                  sx={{ width: '50px', padding: 0 }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                padding: '20px 40px',
                overflowY: 'auto',
                background: imageUrl
                  ? `linear-gradient(rgba(255, 255, 255, ${1 - backgroundOpacity}), rgba(255, 255, 255, ${1 - backgroundOpacity})), url(${imageUrl})`
                  : undefined, // Apply a single blended background
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: textColor,
              }}
            >
              {blogFormat === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizedBlogContent }} />
              ) : (
                <pre>{sanitizedBlogContent}</pre>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default BlogContentModal;