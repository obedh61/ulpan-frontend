import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as tus from 'tus-js-client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { crearSubidaVideo, obtenerEstadoVideo } from '../services/api';

const VideoUploader = ({ open, onClose, claseId, claseNumero, onUploadComplete }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fase, setFase] = useState('seleccionar'); // seleccionar | subiendo | procesando | listo | error
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const uploadRef = useRef(null);
  const pollingRef = useRef(null);

  const resetState = useCallback(() => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setFase('seleccionar');
    setError('');
    setVideoData(null);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (uploadRef.current) {
      uploadRef.current.abort();
      uploadRef.current = null;
    }
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;
    event.target.value = '';

    if (!selected.type.startsWith('video/')) {
      setError(t('video.invalidFormat'));
      return;
    }

    // Max 5GB
    if (selected.size > 5 * 1024 * 1024 * 1024) {
      setError(t('video.fileTooLarge'));
      return;
    }

    setFile(selected);
    setError('');
  };

  const startPolling = (videoId) => {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await obtenerEstadoVideo(videoId);
        const video = res.data;

        if (video.estado === 'listo') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setFase('listo');
          setVideoData(video);
          onUploadComplete?.(video);
        } else if (video.estado === 'error') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          setFase('error');
          setError(t('video.processingError'));
        }
      } catch {
        // Ignore polling errors, will retry
      }
    }, 5000);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setFase('subiendo');
    setError('');

    try {
      // Create upload entry in backend + Bunny
      const res = await crearSubidaVideo({ claseId });
      const { video, tusEndpoint, authHeaders } = res.data;
      setVideoData(video);

      // Start TUS upload directly to Bunny CDN
      const upload = new tus.Upload(file, {
        endpoint: tusEndpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: authHeaders,
        metadata: {
          filetype: file.type,
          title: file.name,
        },
        onError: (err) => {
          setFase('error');
          setError(err.message || t('video.uploadError'));
          setUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const pct = Math.round((bytesUploaded / bytesTotal) * 100);
          setProgress(pct);
        },
        onSuccess: () => {
          setFase('procesando');
          setProgress(100);
          startPolling(video._id);
        },
      });

      uploadRef.current = upload;
      upload.start();
    } catch (err) {
      setFase('error');
      setError(err.response?.data?.message || t('video.uploadError'));
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <Dialog open={open} onClose={fase === 'subiendo' || fase === 'procesando' ? undefined : handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('video.uploadTitle', { number: claseNumero })}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* File selection */}
        {fase === 'seleccionar' && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {!file ? (
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
                component="label"
              >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  {t('video.selectFile')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('video.maxSize')}
                </Typography>
                <input type="file" accept="video/*" hidden onChange={handleFileSelect} />
              </Box>
            ) : (
              <Box>
                <Chip
                  label={`${file.name} (${formatFileSize(file.size)})`}
                  onDelete={() => setFile(null)}
                  color="primary"
                  variant="outlined"
                  sx={{ maxWidth: '100%' }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Uploading */}
        {fase === 'subiendo' && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('video.uploading')} — {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        )}

        {/* Processing */}
        {fase === 'procesando' && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {t('video.processing')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('video.processingHint')}
            </Typography>
          </Box>
        )}

        {/* Done */}
        {fase === 'listo' && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography variant="body1" color="success.main" fontWeight={600}>
              {t('video.ready')}
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {fase === 'error' && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
            <Typography variant="body1" color="error.main">
              {t('video.errorOccurred')}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {fase === 'seleccionar' && (
          <>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file}
              startIcon={<CloudUpload />}
            >
              {t('video.upload')}
            </Button>
          </>
        )}
        {(fase === 'listo' || fase === 'error') && (
          <Button variant="contained" onClick={handleClose}>
            {t('common.close')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default VideoUploader;
