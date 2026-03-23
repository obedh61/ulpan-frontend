import { Container, Typography, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isHe = i18n.language === 'he';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isHe ? 'מדיניות פרטיות' : 'Privacy Policy'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {isHe ? 'עדכון אחרון: מרץ 2026' : 'Last updated: March 2026'}
        </Typography>

        <Section
          title={isHe ? '1. מבוא' : '1. Introduction'}
          text={isHe
            ? 'אולפן ירושלים ("אנחנו", "שלנו") מפעילה את אתר ulpanjerusalem.com ("האתר"). מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך כאשר אתה משתמש באתר ובשירותים שלנו.'
            : 'Ulpan Jerusalem ("we", "our", "us") operates the website ulpanjerusalem.com (the "Site"). This Privacy Policy explains how we collect, use, and protect your personal information when you use our Site and services.'}
        />

        <Section
          title={isHe ? '2. מידע שאנו אוספים' : '2. Information We Collect'}
          text={isHe
            ? 'אנו אוספים את המידע הבא:\n• מידע אישי: שם מלא, כתובת דוא"ל, שאתה מספק בעת ההרשמה.\n• מידע תשלום: פרטי עסקה מעובדים באופן מאובטח דרך ספק התשלומים שלנו (Allpay). איננו שומרים מספרי כרטיס אשראי בשרתים שלנו.\n• נתוני שימוש: מידע על האינטראקציה שלך עם האתר, כגון צפייה בסרטונים, התקדמות בקורסים וזמני גישה.'
            : 'We collect the following information:\n• Personal information: full name, email address, that you provide upon registration.\n• Payment information: transaction details processed securely through our payment provider (Allpay). We do not store credit card numbers on our servers.\n• Usage data: information about your interaction with the Site, such as video views, course progress, and access times.'}
        />

        <Section
          title={isHe ? '3. כיצד אנו משתמשים במידע שלך' : '3. How We Use Your Information'}
          text={isHe
            ? 'אנו משתמשים במידע שלך כדי:\n• לספק ולנהל את שירותי הקורסים שלנו.\n• לעבד תשלומים והרשמות.\n• לשלוח הודעות הקשורות לקורס (שיעורים חדשים, קישורי זום, סרטונים חדשים).\n• לשפר את האתר והשירותים שלנו.\n• לתקשר איתך בנוגע לחשבונך.'
            : 'We use your information to:\n• Provide and manage our course services.\n• Process payments and enrollments.\n• Send course-related notifications (new lessons, Zoom links, new videos).\n• Improve our Site and services.\n• Communicate with you regarding your account.'}
        />

        <Section
          title={isHe ? '4. שיתוף מידע' : '4. Information Sharing'}
          text={isHe
            ? 'איננו מוכרים, סוחרים או מעבירים את המידע האישי שלך לצדדים שלישיים, למעט:\n• ספקי שירות תשלום (Allpay) לעיבוד עסקאות.\n• ספקי שירות דוא"ל (Brevo) לשליחת הודעות הקשורות לקורס.\n• ספקי אירוח וידאו (Bunny.net) להזרמת תוכן קורסים.\n• כנדרש על פי חוק או צו בית משפט.'
            : 'We do not sell, trade, or transfer your personal information to third parties, except:\n• Payment service providers (Allpay) for transaction processing.\n• Email service providers (Brevo) for sending course-related notifications.\n• Video hosting providers (Bunny.net) for streaming course content.\n• As required by law or court order.'}
        />

        <Section
          title={isHe ? '5. אבטחת מידע' : '5. Data Security'}
          text={isHe
            ? 'אנו מיישמים אמצעי אבטחה מתאימים כדי להגן על המידע האישי שלך, כולל:\n• הצפנת SSL לכל העברות נתונים.\n• הצפנת סיסמאות (bcrypt).\n• אימות מבוסס JWT עם תוקף מוגבל.\n• אחסון מאובטח של נתוני תשלום דרך Allpay.'
            : 'We implement appropriate security measures to protect your personal information, including:\n• SSL encryption for all data transfers.\n• Password hashing (bcrypt).\n• JWT-based authentication with limited expiry.\n• Secure payment data handling through Allpay.'}
        />

        <Section
          title={isHe ? '6. עוגיות (Cookies)' : '6. Cookies'}
          text={isHe
            ? 'האתר שלנו משתמש באחסון מקומי (localStorage) לשמירת העדפות שפה ואסימוני אימות. איננו משתמשים בעוגיות מעקב של צד שלישי.'
            : 'Our Site uses local storage (localStorage) to save language preferences and authentication tokens. We do not use third-party tracking cookies.'}
        />

        <Section
          title={isHe ? '7. הזכויות שלך' : '7. Your Rights'}
          text={isHe
            ? 'יש לך את הזכות:\n• לגשת למידע האישי שלך.\n• לבקש תיקון נתונים שגויים.\n• לבקש מחיקת חשבונך ונתונים אישיים.\n• לבטל הסכמה לקבלת הודעות.\n\nלמימוש זכויותיך, צור קשר עמנו בכתובת ulpanjerusalem8@gmail.com.'
            : 'You have the right to:\n• Access your personal information.\n• Request correction of inaccurate data.\n• Request deletion of your account and personal data.\n• Opt out of receiving notifications.\n\nTo exercise your rights, contact us at ulpanjerusalem8@gmail.com.'}
        />

        <Section
          title={isHe ? '8. שינויים במדיניות' : '8. Changes to This Policy'}
          text={isHe
            ? 'אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים יפורסמו בדף זה עם תאריך עדכון חדש.'
            : 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.'}
        />

        <Section
          title={isHe ? '9. יצירת קשר' : '9. Contact Us'}
          text={isHe
            ? 'אם יש לך שאלות בנוגע למדיניות פרטיות זו, צור קשר עמנו:\n• דוא"ל: ulpanjerusalem8@gmail.com\n• טלפון: +972 052-702-8337\n• כתובת: באכר זאב 8, ירושלים'
            : 'If you have any questions about this Privacy Policy, contact us:\n• Email: ulpanjerusalem8@gmail.com\n• Phone: +972 052-702-8337\n• Address: Bacher Ze\'ev Street 8, Jerusalem'}
        />
      </Paper>
    </Container>
  );
};

const Section = ({ title, text }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
      {text}
    </Typography>
  </Box>
);

export default PrivacyPolicy;
