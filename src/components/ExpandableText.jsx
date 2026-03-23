import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LinkifiedText from './LinkifiedText';

const ExpandableText = ({ text, maxLines = 3, sx = {}, buttonSx = {} }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // Compare scrollHeight vs clamped height to detect overflow
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    setNeedsTruncation(el.scrollHeight > lineHeight * maxLines + 2);
  }, [text, maxLines]);

  if (!text) return null;

  return (
    <Box>
      <Typography
        ref={textRef}
        variant="body1"
        sx={{
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: 1.75,
          ...(!expanded && needsTruncation
            ? {
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }
            : {}),
          ...sx,
        }}
      >
        <LinkifiedText text={text} />
      </Typography>
      {needsTruncation && (
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            mt: 0.5,
            p: 0,
            minWidth: 'auto',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            ...buttonSx,
          }}
        >
          {expanded ? t('common.readLess') : t('common.readMore')}
        </Button>
      )}
    </Box>
  );
};

export default ExpandableText;
