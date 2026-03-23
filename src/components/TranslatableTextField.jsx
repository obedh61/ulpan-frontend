import { useState } from 'react';
import { TextField, Tabs, Tab, Box } from '@mui/material';

const langs = [
  { code: 'es', label: '🇪🇸 ES' },
  { code: 'en', label: '🇬🇧 EN' },
  { code: 'he', label: '🇮🇱 HE' },
];

const TranslatableTextField = ({ label, value = {}, onChange, multiline, rows, ...props }) => {
  const [tab, setTab] = useState(0);
  const currentLang = langs[tab].code;

  const handleChange = (e) => {
    onChange({
      ...value,
      [currentLang]: e.target.value,
    });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ minHeight: 32, mb: 0.5 }}
      >
        {langs.map((l) => (
          <Tab
            key={l.code}
            label={l.label}
            sx={{
              minHeight: 32,
              py: 0.5,
              fontSize: '0.75rem',
              minWidth: 60,
            }}
          />
        ))}
      </Tabs>
      <TextField
        label={`${label} (${currentLang.toUpperCase()})`}
        fullWidth
        margin="dense"
        value={value[currentLang] || ''}
        onChange={handleChange}
        multiline={multiline}
        rows={rows}
        dir={currentLang === 'he' ? 'rtl' : 'ltr'}
        {...props}
      />
    </Box>
  );
};

export default TranslatableTextField;
