import React, { useState } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Typography,
  Slider,
  TextField,
} from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandIcon from '@mui/icons-material/Expand';
import DeleteIcon from '@mui/icons-material/Delete';
import { MenuItem } from '@mui/material';
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

const BlogContentModal: React.FC<BlogContentModalProps> = ({
  blogContent,
  setBlogContent,
  imageUrl,
  blogFormat,
  open,
  setOpen,
  setBlogFormat,
  setImageUrl,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.7);
  const [textColor, setTextColor] = useState('#333');
  const [fontFamily, setFontFamily] = useState<string>('serif');
  const [fontWeight, setFontWeight] = useState<number>(600);

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
    setBlogContent('');
    setImageUrl(undefined);
    setBlogFormat('html');
  };

  const sanitizedBlogContent = blogContent.replace(/<img[^>]*>/g, '');

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
                flexWrap: 'wrap',
                gap: '10px',
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
                  sx={{ width: '120px' }}
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Font Family:</Typography>
                <TextField
                  select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: '150px',
                    fontFamily: fontFamily,
                    borderRadius: '20px',
                    backgroundColor: '#f0f0f0',
                    '& .MuiInputBase-root': {
                      fontFamily: fontFamily,
                    },
                  }}
                >
                  <MenuItem value="serif">Serif</MenuItem>
                  <MenuItem value="sans-serif">Sans Serif</MenuItem>
                  <MenuItem value="monospace">Monospace</MenuItem>
                  <MenuItem value="'Playfair Display', serif">Playfair Display</MenuItem>
                  <MenuItem value="'DM Sans', sans-serif">DM Sans</MenuItem>
                  <MenuItem value="'Poppins', sans-serif">Poppins</MenuItem>
                </TextField>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Font Weight:</Typography>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  value={fontWeight}
                  onChange={(e) => setFontWeight(Number(e.target.value))}
                  size="small"
                >
                  <option value={300}>300</option>
                  <option value={400}>400 (Normal)</option>
                  <option value={600}>600</option>
                  <option value={700}>700 (Bold)</option>
                  <option value={900}>900</option>
                </TextField>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                padding: '20px 40px',
                overflowY: 'auto',
                background: imageUrl
                  ? `linear-gradient(rgba(255, 255, 255, ${1 - backgroundOpacity}), rgba(255, 255, 255, ${1 - backgroundOpacity})), url(${imageUrl})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: textColor,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
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