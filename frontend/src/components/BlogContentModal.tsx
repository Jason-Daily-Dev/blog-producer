import React, { useState } from 'react';
import { Box, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandIcon from '@mui/icons-material/Expand';

interface BlogContentModalProps {
  blogContent: string;
  imageUrl?: string;
  blogFormat: string;
}

const BlogContentModal: React.FC<BlogContentModalProps> = ({ blogContent, imageUrl, blogFormat }) => {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);

  const handleClose = () => setOpen(false);
  const handleMinimize = () => setMinimized(!minimized);

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
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#333',
              }}
            >
              {blogFormat === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: blogContent }} />
              ) : (
                <pre>{blogContent}</pre>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default BlogContentModal;