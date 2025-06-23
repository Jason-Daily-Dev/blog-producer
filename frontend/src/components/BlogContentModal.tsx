import React, { useState } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Typography,
  Slider,
  TextField,
  MenuItem,
} from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import ExpandIcon from '@mui/icons-material/Expand';
import DeleteIcon from '@mui/icons-material/Delete';

interface BlogContentModalProps {
  blogContent: {[key: string]: string};
  imageUrl?: string;
  blogFormat: string;
  setBlogContent: (content: {[key: string]: string}) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setImageUrl: (url: string | undefined) => void;
  setBlogFormat: (format: string) => void;
}

const globalBlogStyle = `
  .blog-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .media-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }

  .media-block:nth-of-type(even) {
    flex-direction: row-reverse;
  }

  .media-block img {
    width: 200 px;
    height: 200 px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
    margin-right: 20px;
    margin-left: 20px;
  }

  .media-block p {
    margin: 0;
    flex: 1;
    line-height: 1.6;
  }

  .blog-content h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  @media (max-width: 640px) {
    .media-block {
      flex-direction: column !important;
      align-items: center;
    }

    .media-block p {
      text-align: justify;
    }
  }
`;

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
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3);
  const [textColor, setTextColor] = useState('#333');
  const [fontFamily, setFontFamily] = useState('serif');
  const [fontWeight, setFontWeight] = useState(600);
  const [currentLanguage, setCurrentLanguage] = useState<string>('');

  React.useEffect(() => {
    const languages = Object.keys(blogContent);
    if (languages.length > 0 && !currentLanguage) {
      setCurrentLanguage(languages[0]);
    }
  }, [blogContent, currentLanguage]);

  const handleReset = () => {
    setOpen(false);
    setMinimized(false);
    setBackgroundOpacity(0.5);
    setTextColor('#333');
    setBlogContent({});
    setImageUrl(undefined);
    setBlogFormat('html');
    setCurrentLanguage('');
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: minimized ? '90%' : '10%',
          left: '50%',
          transform: 'translate(-50%, -10%)',
          width: minimized ? '300px' : '80%',
          height: minimized ? '50px' : '90%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
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
            }}
          >
            <Typography variant="body1">Generated Blog</Typography>
            <IconButton onClick={() => setMinimized(false)}>
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
                <IconButton onClick={() => setMinimized(true)}>
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
              {/* Background Transparency */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Background Transparency:</Typography>
                <Slider
                  value={backgroundOpacity}
                  onChange={(_, v) => typeof v === 'number' && setBackgroundOpacity(v)}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={{ width: '120px' }}
                />
              </Box>

              {/* Text Color */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Text Color:</Typography>
                <TextField
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  size="small"
                  sx={{ width: '50px', padding: 0 }}
                />
              </Box>

              {/* Font Family */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body2">Font Family:</Typography>
                <TextField
                  select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: '150px',
                    fontFamily,
                    backgroundColor: '#f0f0f0',
                    '& .MuiInputBase-root': { fontFamily },
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

              {/* Font Weight */}
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
                  <option value={400}>400</option>
                  <option value={600}>600</option>
                  <option value={700}>700</option>
                  <option value={900}>900</option>
                </TextField>
              </Box>

              {/* Language Selection */}
              {Object.keys(blogContent).length > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Typography variant="body2">Language:</Typography>
                  <TextField
                    select
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    size="small"
                    sx={{ minWidth: '180px' }}
                  >
                    {Object.keys(blogContent).map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang === 'english' ? 'English' : 
                         lang === 'simplified_chinese' ? '简体中文' :
                         lang === 'traditional_chinese' ? '繁體中文' : lang}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            </Box>

            {/* Blog Content Area */}
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
                fontFamily,
                fontWeight,
              }}
            >
              {currentLanguage && blogContent[currentLanguage] ? (
                blogFormat === 'html' ? (
                  <div className="blog-content">
                    <style>{globalBlogStyle}</style>
                    <div dangerouslySetInnerHTML={{ __html: blogContent[currentLanguage] }} />
                  </div>
                ) : (
                  <pre>{blogContent[currentLanguage]}</pre>
                )
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                  No content available for selected language
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default BlogContentModal;