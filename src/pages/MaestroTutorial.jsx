import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Alert,
} from '@mui/material';
import {
  Videocam,
  CloudUpload,
  PictureAsPdf,
  School,
  Edit,
  ArrowBack,
  PlayCircle,
  CheckCircle,
  UploadFile,
  Save,
  Visibility,
} from '@mui/icons-material';

const InlineIcon = ({ icon, color, label }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.3,
      bgcolor: color ? `${color}18` : 'action.hover',
      color: color || 'text.secondary',
      borderRadius: 1,
      px: 0.6,
      py: 0.15,
      mx: 0.3,
      verticalAlign: 'middle',
      fontSize: '0.8rem',
      fontWeight: 600,
    }}
  >
    {icon}
    {label && <span>{label}</span>}
  </Box>
);

const StepIcon = ({ icon, color }) => (
  <Box
    sx={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      bgcolor: `${color}14`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {icon}
  </Box>
);

const DetailCard = ({ icon, color, title, items }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      mt: 1.5,
      borderColor: `${color}40`,
      borderRadius: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <StepIcon icon={icon} color={color} />
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
    </Box>
    <Box component="ol" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.75 } }}>
      {items.map((item, i) => (
        <li key={i}>
          <Typography variant="body2" color="text.secondary">
            {item}
          </Typography>
        </li>
      ))}
    </Box>
  </Paper>
);

const MaestroTutorial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/maestro/dashboard')}
        sx={{ mb: 2 }}
      >
        {t('maestro.backToPanel')}
      </Button>

      <Typography variant="h4" gutterBottom fontWeight={700}>
        {t('tutorial.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('tutorial.subtitle')}
      </Typography>

      {/* Workflow overview */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
          {t('tutorial.workflowTitle')}
        </Typography>
        <Typography variant="body2">
          {t('tutorial.workflowSummary')}
        </Typography>
      </Alert>

      <Stepper orientation="vertical" sx={{ '& .MuiStepConnector-line': { minHeight: 24 } }}>
        {/* Step 1 — Access your course */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#5C6BC0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                1
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step1Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tutorial.step1Desc')}
            </Typography>
            <DetailCard
              icon={<School sx={{ color: '#5C6BC0' }} />}
              color="#5C6BC0"
              title={t('tutorial.step1DetailTitle')}
              items={[
                t('tutorial.step1Detail1'),
                t('tutorial.step1Detail2'),
                <>{t('tutorial.step1Detail3_pre')}<InlineIcon icon={<School sx={{ fontSize: 14 }} />} color="#5C6BC0" label={t('maestro.viewDetails')} />{t('tutorial.step1Detail3_post')}</>,
              ]}
            />
          </StepContent>
        </Step>

        {/* Step 2 — Add Zoom link */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                2
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step2Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tutorial.step2Desc')}
            </Typography>
            <DetailCard
              icon={<Videocam sx={{ color: '#4CAF50' }} />}
              color="#4CAF50"
              title={t('tutorial.step2DetailTitle')}
              items={[
                t('tutorial.step2Detail1'),
                <>{t('tutorial.step2Detail2_pre')}<InlineIcon icon={<Edit sx={{ fontSize: 14 }} />} color="#5C6BC0" />{t('tutorial.step2Detail2_post')}</>,
                <>{t('tutorial.step2Detail3_pre')}<InlineIcon icon={<Videocam sx={{ fontSize: 14 }} />} color="#4CAF50" label={t('maestro.zoomLink')} />{t('tutorial.step2Detail3_post')}</>,
                <>{t('tutorial.step2Detail4_pre')}<InlineIcon icon={<Save sx={{ fontSize: 14 }} />} color="#5C6BC0" label={t('common.save')} /></>,
              ]}
            />
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                {t('tutorial.step2Tip')}
              </Typography>
            </Alert>
          </StepContent>
        </Step>

        {/* Step 3 — Teach the class */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#2D8CFF',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                3
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step3Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tutorial.step3Desc')}
            </Typography>
            <Alert severity="warning" sx={{ mt: 1 }}>
              <Typography variant="body2">
                {t('tutorial.step3Tip')}
              </Typography>
            </Alert>
          </StepContent>
        </Step>

        {/* Step 4 — Upload video */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#FF7043',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                4
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step4Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tutorial.step4Desc')}
            </Typography>
            <DetailCard
              icon={<CloudUpload sx={{ color: '#FF7043' }} />}
              color="#FF7043"
              title={t('tutorial.step4DetailTitle')}
              items={[
                <>{t('tutorial.step4Detail1_pre')}<InlineIcon icon={<CloudUpload sx={{ fontSize: 14 }} />} color="#FF7043" />{t('tutorial.step4Detail1_post')}</>,
                t('tutorial.step4Detail2'),
                t('tutorial.step4Detail3'),
                <>{t('tutorial.step4Detail4_pre')}<InlineIcon icon={<CloudUpload sx={{ fontSize: 14 }} />} color="#FF7043" label={t('tutorial.uploadVideoBtn')} />{t('tutorial.step4Detail4_post')}</>,
                <>{t('tutorial.step4Detail5_pre')}<InlineIcon icon={<CheckCircle sx={{ fontSize: 14 }} />} color="#4CAF50" label={t('tutorial.videoReadyLabel')} />{t('tutorial.step4Detail5_post')}</>,
              ]}
            />
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 1.5,
                borderColor: '#FF704340',
                borderRadius: 2,
                bgcolor: '#FFF3E0',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {t('tutorial.videoFormats')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                MP4, MOV, AVI, MKV — {t('tutorial.maxSize')}
              </Typography>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 1.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('tutorial.videoStates')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: t('tutorial.stateUploading'), color: '#FF9800', icon: <CloudUpload sx={{ fontSize: 16 }} /> },
                  { label: t('tutorial.stateProcessing'), color: '#2196F3', icon: <PlayCircle sx={{ fontSize: 16 }} /> },
                  { label: t('tutorial.stateReady'), color: '#4CAF50', icon: <CheckCircle sx={{ fontSize: 16 }} /> },
                ].map((s) => (
                  <Box key={s.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: s.color }}>{s.icon}</Box>
                    <Typography variant="body2">{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </StepContent>
        </Step>

        {/* Step 5 — Upload PDF */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#E91E63',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                5
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step5Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('tutorial.step5Desc')}
            </Typography>
            <DetailCard
              icon={<PictureAsPdf sx={{ color: '#E91E63' }} />}
              color="#E91E63"
              title={t('tutorial.step5DetailTitle')}
              items={[
                <>{t('tutorial.step5Detail1_pre')}<InlineIcon icon={<Edit sx={{ fontSize: 14 }} />} color="#5C6BC0" />{t('tutorial.step5Detail1_post')}</>,
                <>{t('tutorial.step5Detail2_pre')}<InlineIcon icon={<UploadFile sx={{ fontSize: 14 }} />} color="#E91E63" label={t('maestro.uploadPdf')} /></>,
                t('tutorial.step5Detail3'),
                t('tutorial.step5Detail4'),
              ]}
            />
          </StepContent>
        </Step>

        {/* Step 6 — Done */}
        <Step active expanded>
          <StepLabel
            StepIconComponent={() => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#5C6BC0',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <CheckCircle sx={{ fontSize: 18 }} />
              </Box>
            )}
          >
            <Typography variant="h6" fontWeight={600}>
              {t('tutorial.step6Title')}
            </Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('tutorial.step6Desc')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<School />}
              onClick={() => navigate('/maestro/dashboard')}
            >
              {t('tutorial.goToDashboard')}
            </Button>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default MaestroTutorial;
