import { useEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import { trackVideoProgress } from '../services/api';

const TRACK_INTERVAL = 10000; // 10 seconds

const BunnyPlayer = ({ embedUrl, title = '', videoId = null }) => {
  const iframeRef = useRef(null);
  const trackingRef = useRef({ currentTime: 0, duration: 0, completed: false });
  const intervalRef = useRef(null);

  const sendProgress = useCallback(async () => {
    if (!videoId) return;
    const { currentTime, duration, completed } = trackingRef.current;
    if (currentTime <= 0 || duration <= 0) return;

    try {
      await trackVideoProgress(videoId, { currentTime, duration, completed });
    } catch {
      // Ignore tracking errors silently
    }
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

    const handleMessage = (event) => {
      // Bunny player sends postMessage events
      if (!event.data || typeof event.data !== 'object') return;

      const { event: eventName, data } = event.data;

      if (eventName === 'timeupdate' && data) {
        trackingRef.current.currentTime = data.currentTime || 0;
        trackingRef.current.duration = data.duration || 0;
      }

      if (eventName === 'ended') {
        trackingRef.current.completed = true;
        sendProgress();
      }
    };

    window.addEventListener('message', handleMessage);

    // Send progress every 10 seconds
    intervalRef.current = setInterval(() => {
      sendProgress();
    }, TRACK_INTERVAL);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Send final progress on unmount
      sendProgress();
    };
  }, [videoId, sendProgress]);

  if (!embedUrl) return null;

  // Append ?autoplay=false&responsive=true to enable postMessage API
  const embedSrc = embedUrl.includes('?')
    ? `${embedUrl}&autoplay=false&responsive=true`
    : `${embedUrl}?autoplay=false&responsive=true`;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        bgcolor: 'black',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        component="iframe"
        ref={iframeRef}
        src={embedSrc}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </Box>
  );
};

export default BunnyPlayer;
