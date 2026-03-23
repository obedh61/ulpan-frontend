import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Skeleton,
  Card,
  Paper,
} from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CourseCard from '../components/CourseCard';
import { getCourses, enrollInCourse, getMyEnrollments } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CardSkeleton = () => (
  <Card sx={{ overflow: 'hidden', height: 400 }}>
    <Skeleton variant="rectangular" height={150} animation="wave" />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" sx={{ fontSize: '1.1rem', mb: 0.5 }} width="80%" />
      <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="70%" sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" height={38} sx={{ borderRadius: '10px' }} />
    </Box>
  </Card>
);

const Courses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getCourses();
        setCourses(coursesRes.data);

        if (user?.rol === 'alumno') {
          const enrollRes = await getMyEnrollments();
          setEnrolledIds(enrollRes.data.map((e) => e.cursoId._id));
        }
      } catch (error) {
        setMessage({ text: t('courses.loadError'), type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, t]);

  const handleEnroll = async (cursoId) => {
    try {
      await enrollInCourse(cursoId);
      setEnrolledIds([...enrolledIds, cursoId]);
      setMessage({ text: t('courses.enrollSuccess'), type: 'success' });
    } catch (error) {
      if (error.response?.data?.requiresPayment) {
        navigate(`/alumno/curso/${cursoId}/pagar`);
        return;
      }
      setMessage({
        text: error.response?.data?.message || t('courses.enrollError'),
        type: 'error',
      });
    }
  };

  const renderCards = () => {
    if (loading) {
      return [1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ width: { xs: '100%', sm: 'calc(50% - 20px)', md: 'calc(33.33% - 20px)', lg: 'calc(25% - 24px)' } }}>
          <CardSkeleton />
        </Box>
      ));
    }
    return courses.map((course, index) => (
      <Box key={course._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 20px)', md: 'calc(33.33% - 20px)', lg: 'calc(25% - 24px)' } }}>
        <CourseCard
          course={course}
          onEnroll={user?.rol === 'alumno' ? handleEnroll : null}
          enrolled={enrolledIds.includes(course._id)}
          index={index}
        />
      </Box>
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {t('courses.availableCourses')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('courses.exploreDescription')}
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ text: '', type: 'success' })}>
          {message.text}
        </Alert>
      )}

      {!loading && courses.length === 0 ? (
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
            <MenuBook sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('courses.noCourses')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('courses.checkBack')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {renderCards()}
        </Box>
      )}
    </Container>
  );
};

export default Courses;
