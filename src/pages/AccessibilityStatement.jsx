import { Container, Typography, Paper, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

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

const AccessibilityStatement = () => {
  const { i18n } = useTranslation();
  const isHe = i18n.language === 'he';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isHe ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {isHe ? 'עדכון אחרון: מרץ 2026' : 'Last updated: March 2026'}
        </Typography>

        <Section
          title={isHe ? '1. מחויבות לנגישות' : '1. Commitment to Accessibility'}
          text={isHe
            ? 'אולפן ירושלים מחויב להנגשת האתר והשירותים שלו לכל אדם, כולל אנשים עם מוגבלויות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלויות (התאמות נגישות לשירות), התשע"ג-2013, ובהתאם לתקן הישראלי ת"י 5568 המבוסס על הנחיות WCAG 2.0 ברמה AA.'
            : 'Ulpan Jerusalem is committed to making its website and services accessible to all people, including persons with disabilities, in accordance with the Israeli Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 5773-2013, and the Israeli Standard IS 5568, based on WCAG 2.0 Level AA guidelines.'}
        />

        <Section
          title={isHe ? '2. אמצעי נגישות באתר' : '2. Accessibility Features'}
          text={isHe
            ? 'האתר שלנו כולל את התאמות הנגישות הבאות:\n• כפתור נגישות קבוע (בצד שמאל למטה) המאפשר התאמות מיידיות.\n• שינוי גודל גופן — הגדלה והקטנה של טקסט.\n• ניגודיות גבוהה — הגברת הניגודיות לקריאה נוחה יותר.\n• גווני אפור — הצגת האתר בגווני אפור לנוחות חזותית.\n• הדגשת קישורים — סימון בולט של כל הקישורים באתר.\n• מרווח שורות מוגדל — הגדלת המרווח בין השורות לקריאה נוחה.\n• תמיכה מלאה בניווט מקלדת.\n• תמיכה בקוראי מסך (ARIA labels).\n• תמיכה בכיווניות RTL (עברית) ו-LTR (אנגלית/ספרדית).\n• עיצוב רספונסיבי המותאם לכל גודל מסך.'
            : 'Our website includes the following accessibility features:\n• Persistent accessibility button (bottom left) for immediate adjustments.\n• Font size control — increase and decrease text size.\n• High contrast — enhanced contrast for easier reading.\n• Grayscale — display the site in grayscale for visual comfort.\n• Highlight links — clearly mark all links on the site.\n• Increased line spacing — enlarged spacing between lines for readability.\n• Full keyboard navigation support.\n• Screen reader compatibility (ARIA labels).\n• RTL (Hebrew) and LTR (English/Spanish) direction support.\n• Responsive design adapted to all screen sizes.'}
        />

        <Section
          title={isHe ? '3. תקן נגישות' : '3. Accessibility Standard'}
          text={isHe
            ? 'אתר זה עומד בדרישות תקן ת"י 5568 ברמה AA, בהתאם להנחיות WCAG 2.0 (Web Content Accessibility Guidelines) של ארגון W3C. אנו פועלים באופן שוטף לשפר את נגישות האתר ולעמוד בסטנדרטים העדכניים ביותר.'
            : 'This website complies with the requirements of Israeli Standard IS 5568 at Level AA, in accordance with the WCAG 2.0 (Web Content Accessibility Guidelines) of the W3C. We continuously work to improve the accessibility of our website and meet the latest standards.'}
        />

        <Section
          title={isHe ? '4. טכנולוגיות נגישות' : '4. Assistive Technologies'}
          text={isHe
            ? 'האתר נבנה תוך שימוש בטכנולוגיות התומכות בנגישות:\n• HTML5 סמנטי עם תפקידי ARIA מתאימים.\n• React עם Material UI (MUI) — ספריית ממשק משתמש העומדת בתקני נגישות.\n• תמיכה בדפדפנים מודרניים וטכנולוגיות מסייעות כגון JAWS, NVDA, VoiceOver ו-TalkBack.'
            : 'The website was built using accessibility-supporting technologies:\n• Semantic HTML5 with appropriate ARIA roles.\n• React with Material UI (MUI) — a UI library that meets accessibility standards.\n• Support for modern browsers and assistive technologies such as JAWS, NVDA, VoiceOver, and TalkBack.'}
        />

        <Section
          title={isHe ? '5. בעיות נגישות ידועות' : '5. Known Accessibility Issues'}
          text={isHe
            ? 'אנו משקיעים מאמצים רבים להנגיש את כל תכני האתר. עם זאת, ייתכן שחלק מהתכנים, כגון סרטוני וידאו של צד שלישי (Bunny.net), אינם נגישים באופן מלא. אנו עובדים על שיפור מתמיד של תכנים אלו.'
            : 'We invest significant effort in making all website content accessible. However, some content, such as third-party videos (Bunny.net), may not be fully accessible. We are continuously working to improve these elements.'}
        />

        <Section
          title={isHe ? '6. משוב ויצירת קשר' : '6. Feedback and Contact'}
          text={isHe
            ? 'אנו מעוניינים לשמוע על בעיות נגישות שנתקלתם בהן או הצעות לשיפור. ניתן לפנות אלינו:\n\n• דוא"ל: ulpanjerusalem8@gmail.com\n• טלפון: +972 052-702-8337\n• כתובת: רחוב באכר זאב 8, ירושלים\n\nאנו מתחייבים לטפל בפניות נגישות תוך 7 ימי עסקים.'
            : 'We welcome feedback on accessibility issues or suggestions for improvement. You can contact us at:\n\n• Email: ulpanjerusalem8@gmail.com\n• Phone: +972 052-702-8337\n• Address: Bacher Ze\'ev Street 8, Jerusalem\n\nWe commit to addressing accessibility inquiries within 7 business days.'}
        />

        <Section
          title={isHe ? '7. מסגרת משפטית' : '7. Legal Framework'}
          text={isHe
            ? 'הצהרת נגישות זו נכתבה בהתאם לדרישות החוק הישראלי:\n• חוק שוויון זכויות לאנשים עם מוגבלויות, התשנ"ח-1998.\n• תקנות שוויון זכויות לאנשים עם מוגבלויות (התאמות נגישות לשירות), התשע"ג-2013.\n• תקן ישראלי ת"י 5568 — הנגשת תכנים באינטרנט.\n\nהאתר נבדק ועודכן לאחרונה בנושאי נגישות במרץ 2026.'
            : 'This accessibility statement was written in accordance with Israeli law requirements:\n• Equal Rights for Persons with Disabilities Law, 5758-1998.\n• Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 5773-2013.\n• Israeli Standard IS 5568 — Web Content Accessibility.\n\nThe website was last reviewed and updated for accessibility in March 2026.'}
        />
      </Paper>
    </Container>
  );
};

export default AccessibilityStatement;
