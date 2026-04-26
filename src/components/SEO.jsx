import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const langMap = { es: 'es_ES', en: 'en_US', he: 'he_IL' };

const SEO = ({ title, description, path = '', type = 'website', image }) => {
  const { language } = useLanguage();
  const baseUrl = 'https://ulpanjerusalem.com';
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/images/portada.png`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={langMap[language] || 'es_ES'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
