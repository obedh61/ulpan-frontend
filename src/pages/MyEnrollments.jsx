import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Skeleton,
} from '@mui/material';
import { School, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CourseCard from '../components/CourseCard';
import { getMyEnrollments } from '../services/api';

const CardSkeleton = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
    <CardActions>
      <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
    </CardActions>
  </Card>
);

const MyEnrollments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await getMyEnrollments();
        setEnrollments(res.data.filter((e) => e.cursoId));
      } catch (err) {
        setError(t('alumno.loadEnrollError'));
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [t]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 1, textAlign: 'center' }}>
        {t('alumno.myCourses')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        {t('alumno.enrolledIn')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : enrollments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(92, 107, 192, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <School sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('alumno.notEnrolled')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('alumno.exploreMessage')}
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/cursos')}
          >
            {t('alumno.exploreCourses')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {enrollments.map((enrollment) => (
            <Grid item xs={12} sm={6} md={4} key={enrollment._id}>
              <CourseCard course={enrollment.cursoId} enrolled />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyEnrollments;
