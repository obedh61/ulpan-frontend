import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
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
  AutoStories,
  AccessTime,
  OndemandVideo,
  Description,
  Laptop,
  Schedule,
  Public,
  RecordVoiceOver,
  WhatsApp,
  Favorite,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const whyCards = [
    { icon: <AutoStories />, title: t('home.why1Title'), desc: t('home.why1Desc'), color: '#5C6BC0' },
    { icon: <AccessTime />, title: t('home.why2Title'), desc: t('home.why2Desc'), color: '#FF7043' },
    { icon: <OndemandVideo />, title: t('home.why3Title'), desc: t('home.why3Desc'), color: '#4CAF50' },
    { icon: <Description />, title: t('home.why4Title'), desc: t('home.why4Desc'), color: '#FF9800' },
    { icon: <Laptop />, title: t('home.why5Title'), desc: t('home.why5Desc'), color: '#2196F3' },
    { icon: <Schedule />, title: t('home.why6Title'), desc: t('home.why6Desc'), color: '#9C27B0' },
    { icon: <Public />, title: t('home.why7Title'), desc: t('home.why7Desc'), color: '#00BCD4' },
    { icon: <RecordVoiceOver />, title: t('home.why8Title'), desc: t('home.why8Desc'), color: '#E91E63' },
    { icon: <WhatsApp />, title: t('home.why9Title'), desc: t('home.why9Desc'), color: '#25D366' },
  ];

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
      <SEO title={t('seo.homeTitle')} description={t('seo.homeDesc')} path="/" />
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

      {/* Why Ulpan Jerusalem */}
      <Box sx={{ bgcolor: '#F8F9FC', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 3 }}>
            <Typography
              variant="overline"
              color="primary.main"
              fontWeight={700}
              letterSpacing={2}
              sx={{ fontSize: '0.8rem' }}
            >
              {t('home.whyUniqueTitle')}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 2 }}>
              {t('home.whyTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 680, mx: 'auto', lineHeight: 1.8, mb: 1 }}
            >
              {t('home.whySubtitle')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 680, mx: 'auto', lineHeight: 1.7 }}
            >
              {t('home.whyMethodology')}
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {whyCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Paper
                  sx={{
                    p: 3.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'rgba(0,0,0,0.06)',
                    borderRadius: 3,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(92, 107, 192, 0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      bgcolor: `${card.color}14`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      '& .MuiSvgIcon-root': { fontSize: 26, color: card.color },
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {card.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission + Value */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                background: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 100%)',
                color: 'white',
                borderRadius: 4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Favorite sx={{ fontSize: 28 }} />
                <Typography variant="h5" fontWeight={700}>
                  {t('home.missionTitle')}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.95 }}>
                {t('home.missionDesc')}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Star sx={{ fontSize: 28, color: '#FF7043' }} />
              <Typography variant="h5" fontWeight={700}>
                {t('home.valueTitle')}
              </Typography>
            </Box>
            <Stack spacing={2}>
              {[t('home.value1'), t('home.value2'), t('home.value3'), t('home.value4')].map((v) => (
                <Box key={v} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CheckCircle sx={{ color: '#4CAF50', fontSize: 22 }} />
                  <Typography variant="body1" fontWeight={500}>
                    {v}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(user ? '/cursos' : '/register')}
              sx={{
                mt: 4,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: '12px',
              }}
            >
              {user ? t('home.viewCourses') : t('home.startJourney')}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
