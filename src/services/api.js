import axios from 'axios';

// Dev: proxy de Vite redirige /api → localhost:5000
// Prod: VITE_API_URL apunta al backend en Render
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/perfil');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
export const resendVerification = (email, idioma) => api.post('/auth/resend-verification', { email, idioma });

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Enrollments
export const enrollInCourse = (cursoId) => api.post('/enrollments', { cursoId });
export const getMyEnrollments = () => api.get('/enrollments/mis-cursos');
export const getEnrollmentsByCourse = (cursoId) => api.get(`/enrollments/curso/${cursoId}`);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);

// Admin
export const getEstadisticas = () => api.get('/admin/estadisticas');
export const getUsuarios = () => api.get('/admin/usuarios');
export const crearUsuario = (data) => api.post('/admin/usuarios', data);
export const actualizarUsuario = (id, data) => api.put(`/admin/usuarios/${id}`, data);
export const eliminarUsuario = (id) => api.delete(`/admin/usuarios/${id}`);
export const getMaestros = () => api.get('/admin/maestros');
export const getCoursesAdmin = () => api.get('/admin/courses');
export const getClasesCursoAdmin = (cursoId) => api.get(`/admin/courses/${cursoId}/clases`);
export const getAlumnosCursoAdmin = (cursoId) => api.get(`/admin/courses/${cursoId}/alumnos`);
export const actualizarClaseAdmin = (claseId, data) => api.put(`/admin/clases/${claseId}`, data);

// Maestro
export const getMisCursosMaestro = () => api.get('/maestro/courses');
export const getAlumnosCurso = (cursoId) => api.get(`/maestro/courses/${cursoId}/alumnos`);
export const getClasesCursoMaestro = (cursoId) => api.get(`/maestro/courses/${cursoId}/clases`);
export const actualizarClaseMaestro = (claseId, data) => api.put(`/maestro/clases/${claseId}`, data);

// Upload
export const uploadPdf = (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return api.post('/upload/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Videos (Bunny)
export const crearSubidaVideo = (data) => api.post('/maestro/videos/create-upload', data);
export const obtenerEstadoVideo = (id) => api.get(`/maestro/videos/${id}/status`);
export const eliminarVideo = (id) => api.delete(`/maestro/videos/${id}`);
export const obtenerStreamVideo = (id) => api.get(`/alumno/videos/${id}/stream`);
export const trackVideoProgress = (id, data) => api.post(`/alumno/videos/${id}/track`, data);
export const getVideoStatsCurso = (cursoId) => api.get(`/maestro/videos/stats/${cursoId}`);
export const getVideoStatsAlumnos = (cursoId) => api.get(`/maestro/videos/stats/${cursoId}/alumnos`);
export const getAdminVideoStats = () => api.get('/admin/video-stats');

// Alumno
export const getMisCursosAlumno = () => api.get('/alumno/courses');
export const getCursosDisponibles = () => api.get('/alumno/cursos-disponibles');
export const getCursoDetalleAlumno = (id) => api.get(`/alumno/courses/${id}`);

// Payments
export const createPayment = (data) => api.post('/payments/create', data);
export const verifyPayment = (paymentId) => api.get(`/payments/verify/${paymentId}`);
export const getMyPayments = () => api.get('/payments/mis-pagos');

// Exchange rates
export const getExchangeRates = () => api.get('/exchange-rates');

// Coupons
export const createCoupon = (data) => api.post('/coupons', data);
export const getCoupons = () => api.get('/coupons');
export const validateCoupon = (data) => api.post('/coupons/validate', data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data);
export const toggleCoupon = (id) => api.put(`/coupons/${id}/toggle`);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`);

// Admin Ingresos
export const getIngresos = () => api.get('/admin/ingresos');
export const getAdminPayments = (params) => api.get('/admin/payments', { params });

export default api;
