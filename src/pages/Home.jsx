import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Chip,
  Avatar,
  AvatarGroup,
  Stack,
} from '@mui/material';
import {
  Videocam,
  Devices,
  MenuBook,
  CheckCircle,
  FiberManualRecord,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Videocam sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
    },
    {
      icon: <Devices sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
    },
    {
      icon: <MenuBook sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
    },
  ];

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #F8F9FC 0%, #FFFFFF 100%)',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Left Column — Text */}
            <Box>
              <Chip
                icon={<FiberManualRecord sx={{
                  fontSize: '10px !important',
                  color: '#4CAF50 !important',
                  animation: 'pulse-dot 1.5s ease-in-out infinite',
                  '@keyframes pulse-dot': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }} />}
                label={t('home.enrollmentsOpen')}
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(92, 107, 192, 0.08)',
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  height: 36,
                  px: 0.5,
                }}
              />

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  mb: 2.5,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {t('home.heroTitle')}{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    display: 'block',
                  }}
                >
                  {t('home.heroHighlight')}
                </Box>
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  maxWidth: 480,
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                }}
              >
                {t('home.heroDescription')}
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                {!user ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: '12px',
                      }}
                    >
                      {t('home.startJourney')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/cursos')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: '12px',
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 },
                      }}
                    >
                      {t('home.viewCourses')}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/cursos')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: '12px',
                    }}
                  >
                    {t('home.viewCourses')}
                  </Button>
                )}
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <AvatarGroup
                  max={4}
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 38,
                      height: 38,
                      fontSize: 14,
                      border: '2px solid #fff',
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>M</Avatar>
                  <Avatar sx={{ bgcolor: '#4CAF50' }}>D</Avatar>
                  <Avatar sx={{ bgcolor: '#FF9800' }}>R</Avatar>
                </AvatarGroup>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {t('home.activeStudents')}
                </Typography>
              </Stack>
            </Box>

            {/* Right Column — Hero Image */}
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(92, 107, 192, 0.18), 0 8px 24px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box
                  component="img"
                  src="/images/hero-ulpan.png"
                  alt="Estudiante de hebreo en clase online"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {/* Live badge overlay */}
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  bottom: 24,
                  left: -16,
                  px: 2.5,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: '14px',
                  bgcolor: 'background.paper',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 2,
                }}
              >
                <CheckCircle sx={{ color: '#4CAF50', fontSize: 22 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, fontSize: '0.7rem' }}>
                    {t('home.liveLabel')}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {t('home.liveBadge')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container id="method-section" maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" sx={{ mb: 7 }}>
          <Typography
            variant="overline"
            color="primary.main"
            fontWeight={700}
            letterSpacing={2}
            sx={{ fontSize: '0.8rem' }}
          >
            {t('home.ourMethod')}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1.5 }}>
            {t('home.digitalImmersion')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}
          >
            {t('home.methodDescription')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {features.map((f, i) => (
            <Paper
              key={f.title}
              sx={{
                p: 4,
                textAlign: 'center',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default',
                border: '1px solid',
                borderColor: 'rgba(0,0,0,0.06)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 32px rgba(92, 107, 192, 0.12)',
                },
              }}
            >
              <Box
                sx={{
                  width: 68,
                  height: 68,
                  borderRadius: '18px',
                  bgcolor: i === 0
                    ? 'rgba(92, 107, 192, 0.08)'
                    : i === 1
                    ? 'rgba(76, 175, 80, 0.08)'
                    : 'rgba(255, 112, 67, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                {i === 0
                  ? <Videocam sx={{ fontSize: 30, color: 'primary.main' }} />
                  : i === 1
                  ? <Devices sx={{ fontSize: 30, color: '#4CAF50' }} />
                  : <MenuBook sx={{ fontSize: 30, color: 'secondary.main' }} />
                }
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {f.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
