import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemText, Typography } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'es', label: 'Espanol', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' },
];

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);

  const current = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <Typography variant="body2" sx={{ mr: 0.5, fontSize: '1.1rem' }}>
          {current.flag}
        </Typography>
        <Language fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { minWidth: 150 } } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={language === lang.code}
            onClick={() => {
              changeLanguage(lang.code);
              setAnchorEl(null);
            }}
          >
            <Typography sx={{ mr: 1.5, fontSize: '1.1rem' }}>{lang.flag}</Typography>
            <ListItemText>{lang.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
