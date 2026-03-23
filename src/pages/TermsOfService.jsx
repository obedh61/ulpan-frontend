import { Container, Typography, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const { t, i18n } = useTranslation();
  const isHe = i18n.language === 'he';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isHe ? 'תנאי שימוש ומכירה' : 'Terms of Service & Sale'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {isHe ? 'עדכון אחרון: מרץ 2026' : 'Last updated: March 2026'}
        </Typography>

        <Section
          title={isHe ? '1. כללי' : '1. General'}
          text={isHe
            ? 'תנאי שימוש אלה ("התנאים") חלים על השימוש באתר ulpanjerusalem.com ("האתר") ובשירותים המוצעים על ידי אולפן ירושלים ("החברה", "אנחנו"). בשימוש באתר, אתה מסכים לתנאים אלה במלואם. אם אינך מסכים, אנא הימנע משימוש באתר.'
            : 'These Terms of Service ("Terms") apply to the use of the website ulpanjerusalem.com (the "Site") and the services offered by Ulpan Jerusalem (the "Company", "we", "us"). By using the Site, you agree to these Terms in full. If you do not agree, please refrain from using the Site.'}
        />

        <Section
          title={isHe ? '2. תיאור השירותים' : '2. Description of Services'}
          text={isHe
            ? 'אולפן ירושלים מספקת שירותי הוראת עברית מקוונים הכוללים:\n• שיעורים חיים דרך Zoom עם מורים ילידי ישראל.\n• סרטוני וידאו מוקלטים הזמינים 24/7.\n• חומרי לימוד בפורמט PDF להורדה.\n• גישה לפלטפורמת הלמידה המקוונת.\n\nהקורסים מאורגנים בשיעורים, וכל קורס כולל מספר שיעורים כפי שנקבע בעת יצירתו.'
            : 'Ulpan Jerusalem provides online Hebrew language teaching services that include:\n• Live classes via Zoom with native Israeli teachers.\n• Recorded video lessons available 24/7.\n• Downloadable PDF study materials.\n• Access to the online learning platform.\n\nCourses are organized into lessons, and each course includes the number of lessons as determined upon its creation.'}
        />

        <Section
          title={isHe ? '3. הרשמה וחשבון משתמש' : '3. Registration and User Account'}
          text={isHe
            ? '• עליך להירשם כדי לגשת לקורסים.\n• עליך לספק מידע מדויק ועדכני.\n• אתה אחראי לשמירה על סודיות פרטי הכניסה שלך.\n• אסור לשתף את חשבונך עם אחרים.\n• אנו שומרים את הזכות להשעות או למחוק חשבונות המפרים תנאים אלה.'
            : '• You must register to access courses.\n• You must provide accurate and up-to-date information.\n• You are responsible for maintaining the confidentiality of your login credentials.\n• You may not share your account with others.\n• We reserve the right to suspend or delete accounts that violate these Terms.'}
        />

        <Section
          title={isHe ? '4. מחירים ותשלומים' : '4. Pricing and Payments'}
          text={isHe
            ? '• מחירי הקורסים מוצגים באתר במטבע המצוין (שקל, דולר או אירו).\n• התשלום מעובד באופן מאובטח דרך Allpay.\n• עם השלמת התשלום, תקבל גישה מיידית לתוכן הקורס.\n• המחירים עשויים להשתנות, אך שינויים לא ישפיעו על רכישות שכבר בוצעו.\n• ניתן להשתמש בקופונים הנחה בתהליך התשלום בכפוף לתנאי הקופון.'
            : '• Course prices are displayed on the Site in the indicated currency (ILS, USD, or EUR).\n• Payment is processed securely through Allpay.\n• Upon payment completion, you will receive immediate access to the course content.\n• Prices may change, but changes will not affect purchases already made.\n• Discount coupons may be used during the payment process subject to the coupon terms.'}
        />

        <Section
          title={isHe ? '5. מדיניות ביטולים והחזרים' : '5. Cancellation and Refund Policy'}
          text={isHe
            ? '• ניתן לבקש החזר כספי מלא תוך 14 ימים מיום הרכישה, בהתאם לחוק הגנת הצרכן הישראלי.\n• לבקשת ביטול, שלח דוא"ל ל-ulpanjerusalem8@gmail.com עם פרטי ההזמנה.\n• החזרים יעובדו תוך 14 ימי עסקים לאמצעי התשלום המקורי.\n• לאחר תקופת ה-14 ימים, לא יינתנו החזרים.'
            : '• You may request a full refund within 14 days of purchase, in accordance with Israeli Consumer Protection Law.\n• To request a cancellation, send an email to ulpanjerusalem8@gmail.com with your order details.\n• Refunds will be processed within 14 business days to the original payment method.\n• After the 14-day period, no refunds will be issued.'}
        />

        <Section
          title={isHe ? '6. קניין רוחני' : '6. Intellectual Property'}
          text={isHe
            ? '• כל התכנים באתר, כולל סרטונים, חומרי PDF, עיצוב ולוגו, הם רכוש אולפן ירושלים.\n• אין להעתיק, להפיץ, לשדר או ליצור עבודות נגזרות מהתכנים ללא אישור מראש בכתב.\n• הגישה לתכני הקורס היא אישית ואינה ניתנת להעברה.'
            : '• All content on the Site, including videos, PDF materials, design, and logo, are the property of Ulpan Jerusalem.\n• You may not copy, distribute, transmit, or create derivative works from the content without prior written permission.\n• Access to course content is personal and non-transferable.'}
        />

        <Section
          title={isHe ? '7. אחריות והגבלות' : '7. Liability and Limitations'}
          text={isHe
            ? '• אנו מספקים את השירותים "כמות שהם" ואיננו מבטיחים תוצאות ספציפיות מלימוד השפה.\n• איננו אחראים להפרעות טכניות, בעיות חיבור לאינטרנט או בעיות בשירותי צד שלישי (Zoom, וכו\').\n• אחריותנו המקסימלית מוגבלת לסכום ששולם עבור הקורס הרלוונטי.'
            : '• We provide services "as is" and do not guarantee specific results from language learning.\n• We are not responsible for technical interruptions, internet connection issues, or problems with third-party services (Zoom, etc.).\n• Our maximum liability is limited to the amount paid for the relevant course.'}
        />

        <Section
          title={isHe ? '8. שימוש מקובל' : '8. Acceptable Use'}
          text={isHe
            ? 'אתה מסכים שלא:\n• להשתמש באתר למטרות בלתי חוקיות.\n• להקליט או להפיץ שיעורים חיים או סרטונים.\n• לנסות לגשת לחשבונות או מערכות ללא הרשאה.\n• להפריע לפעולת האתר או השרתים.'
            : 'You agree not to:\n• Use the Site for unlawful purposes.\n• Record or distribute live classes or videos.\n• Attempt to access accounts or systems without authorization.\n• Interfere with the operation of the Site or servers.'}
        />

        <Section
          title={isHe ? '9. שינויים בתנאים' : '9. Changes to Terms'}
          text={isHe
            ? 'אנו שומרים את הזכות לעדכן תנאים אלה בכל עת. שינויים ייכנסו לתוקף עם פרסומם באתר. המשך שימוש באתר לאחר עדכון מהווה הסכמה לתנאים המעודכנים.'
            : 'We reserve the right to update these Terms at any time. Changes will take effect upon posting on the Site. Continued use of the Site after an update constitutes acceptance of the updated Terms.'}
        />

        <Section
          title={isHe ? '10. דין חל וסמכות שיפוט' : '10. Governing Law and Jurisdiction'}
          text={isHe
            ? 'תנאים אלה כפופים לדין הישראלי. כל מחלוקת תידון בבתי המשפט המוסמכים בירושלים, ישראל.'
            : 'These Terms are governed by Israeli law. Any dispute shall be resolved in the competent courts of Jerusalem, Israel.'}
        />

        <Section
          title={isHe ? '11. יצירת קשר' : '11. Contact Us'}
          text={isHe
            ? 'לשאלות בנוגע לתנאים אלה, צור קשר עמנו:\n• דוא"ל: ulpanjerusalem8@gmail.com\n• טלפון: +972 052-702-8337\n• כתובת: באכר זאב 8, ירושלים'
            : 'For questions about these Terms, contact us:\n• Email: ulpanjerusalem8@gmail.com\n• Phone: +972 052-702-8337\n• Address: Bacher Ze\'ev Street 8, Jerusalem'}
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

export default TermsOfService;
