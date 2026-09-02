// Legal content — written to reflect the site's ACTUAL behavior:
// static marketing site, no backend/database, no analytics/cookies, no user
// accounts. Contact is via phone (tel:) and WhatsApp. The newsletter field and
// the questionnaire run in the browser only and are not sent to any server.
// Accessibility preferences are stored locally (localStorage) on the device.
// Reviewed against Israeli law: Protection of Privacy Law (incl. Amendment 13,
// 2025) and IS 5568 / Equal-Rights (service accessibility) regulations.

const PHONE = '050-6830881'
const EMAIL = 'info@am-filters.co.il'
const UPDATED_HE = 'ספטמבר 2026'
const UPDATED_EN = 'September 2026'

export const LEGAL = {
  he: {
    privacyTitle: 'מדיניות פרטיות',
    privacyUpdated: `עודכן: ${UPDATED_HE}`,
    privacy: [
      { h: 'כללי', p: [
        'אתר זה של א.מ שיווק מסננים למניעת אבנית ("האתר") הוא אתר תדמיתי־שיווקי בלבד. אנו מכבדים את פרטיותכם ומחויבים לשמור עליה בהתאם לחוק הגנת הפרטיות, התשמ״א־1981 (כולל תיקון 13).',
      ] },
      { h: 'איזה מידע אנחנו אוספים', p: [
        'האתר אינו כולל הרשמת משתמשים, אינו מנהל חשבונות משתמש, ואין לו שרת או מסד נתונים שאוסף או שומר פרטים אישיים.',
        'יצירת קשר נעשית באמצעות לחיצה על מספר הטלפון או על כפתור הוואטסאפ — פעולות אלו מפעילות את אפליקציית הטלפון/הוואטסאפ במכשירכם, ואינן שולחות מידע לאתר עצמו.',
        'טופס הרשמה לרשימת תפוצה: כרגע הטופס אינו מחובר לשירות דיוור ואינו שולח או שומר את כתובת האימייל בשום מקום. אם וכאשר יחובר שירות דיוור, נעדכן מדיניות זו בהתאם.',
        'שאלון "איזה פתרון מתאים לי?": כל התשובות מעובדות בדפדפן שלכם בלבד לצורך הצגת ההמלצה, ואינן נשלחות אלינו או נשמרות בשרת.',
      ] },
      { h: 'עוגיות (Cookies) וכלי מדידה', p: [
        'האתר אינו עושה שימוש בעוגיות מעקב, בכלי אנליטיקה או ברימרקטינג.',
        'העדפות הנגישות שתבחרו נשמרות מקומית בדפדפן שלכם (localStorage) לנוחותכם בלבד, ואינן נשלחות אלינו או לצד שלישי.',
      ] },
      { h: 'שירותים של צד שלישי', p: [
        'לחיצה על כפתור הוואטסאפ פותחת שיחה בשירות WhatsApp (מבית Meta), הכפוף למדיניות הפרטיות שלו.',
        'קישור "המלצות לקוחות במדרג" מפנה לאתר מדרג (midrag.co.il), הכפוף למדיניות הפרטיות שלו.',
        'האתר מתארח על תשתית ענן (Vercel). כמקובל בכל אתר, ספק האירוח עשוי לתעד נתונים טכניים בסיסיים (כגון כתובת IP וסוג הדפדפן) לצורכי אבטחה ותפעול.',
      ] },
      { h: 'הזכויות שלכם', p: [
        'בהתאם לחוק, עומדת לכם הזכות לעיין במידע אישי המוחזק אודותיכם (ככל שקיים), לבקש לתקנו או למחקו. מכיוון שהאתר אינו אוסף מידע אישי בשרת, בקשות מסוג זה יטופלו ביחס למידע שמסרתם לנו ישירות בטלפון או בוואטסאפ.',
        `לפניות בנושא פרטיות: טלפון ${PHONE} · דוא״ל ${EMAIL}.`,
      ] },
      { h: 'עדכונים למדיניות', p: [
        'ייתכן שנעדכן מדיניות זו מעת לעת. הנוסח המעודכן יפורסם בעמוד זה עם תאריך העדכון.',
      ] },
    ],

    a11yTitle: 'הצהרת נגישות',
    a11yUpdated: `עודכן: ${UPDATED_HE}`,
    a11y: [
      { h: 'המחויבות שלנו', p: [
        'א.מ שיווק מסננים רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל הגולשים, לרבות אנשים עם מוגבלות. אנו פועלים להנגיש את האתר בהתאם לתקן הישראלי ת״י 5568 (המבוסס על הנחיות WCAG 2.0 ברמה AA) ולתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג־2013.',
      ] },
      { h: 'מה הונגש באתר', p: [
        'ניווט מלא באמצעות מקלדת ומיקוד (focus) חזותי ברור.',
        'מבנה HTML סמנטי, כותרות היררכיות, וטקסט חלופי לתמונות בעלות משמעות.',
        'תוויות ARIA לכפתורים ולרכיבים אינטראקטיביים, כולל החלונות הקופצים (מודלים) והשאלון.',
        'תמיכה מלאה בעברית ובכיוון RTL, וניגודיות צבעים תקינה.',
        'התאמה להעדפת המערכת להפחתת אנימציות (prefers-reduced-motion).',
      ] },
      { h: 'תפריט הנגישות', p: [
        'באתר מוטמע כפתור נגישות קבוע (בפינת המסך) הפותח תפריט המאפשר: הגדלה והקטנה של גודל הטקסט, מצב ניגודיות גבוהה, הדגשת קישורים, גופן קריא, ועצירת אנימציות. ההעדפות נשמרות במכשירכם.',
      ] },
      { h: 'הסתייגויות', p: [
        'ייתכנו רכיבים או תכנים של צד שלישי (כגון אתר מדרג המקושר מהאתר) שאינם בשליטתנו המלאה. אנו ממשיכים לשפר את הנגישות באופן שוטף.',
      ] },
      { h: 'יצירת קשר בנושא נגישות', p: [
        `נתקלתם בבעיית נגישות? נשמח לסייע. רכז הנגישות זמין בטלפון ${PHONE} או בדוא״ל ${EMAIL}.`,
      ] },
    ],
  },

  en: {
    privacyTitle: 'Privacy Policy',
    privacyUpdated: `Updated: ${UPDATED_EN}`,
    privacy: [
      { h: 'General', p: [
        'This website of A.M. Anti-Limescale Filters ("the Site") is an informational/marketing site only. We respect your privacy and are committed to it under Israel’s Protection of Privacy Law, 1981 (including Amendment 13).',
      ] },
      { h: 'What we collect', p: [
        'The Site has no user registration, no user accounts, and no server or database that collects or stores personal data.',
        'Contact is made by tapping the phone number or the WhatsApp button — these open your phone/WhatsApp app and do not send information to the Site itself.',
        'Newsletter field: it is currently not connected to any mailing service and does not send or store your email anywhere. If a mailing service is connected, this policy will be updated accordingly.',
        'The "which solution fits me?" questionnaire: all answers are processed in your browser only to display the recommendation, and are not sent to us or stored on a server.',
      ] },
      { h: 'Cookies & analytics', p: [
        'The Site does not use tracking cookies, analytics, or remarketing.',
        'Accessibility preferences you choose are stored locally in your browser (localStorage) for your convenience only, and are not sent to us or any third party.',
      ] },
      { h: 'Third-party services', p: [
        'The WhatsApp button opens a chat in WhatsApp (by Meta), governed by its own privacy policy.',
        'The "customer reviews on Midrag" link goes to midrag.co.il, governed by its own privacy policy.',
        'The Site is hosted on cloud infrastructure (Vercel). As with any website, the host may log basic technical data (such as IP address and browser type) for security and operation.',
      ] },
      { h: 'Your rights', p: [
        'By law you may review personal data held about you (if any), and request to correct or delete it. As the Site does not collect personal data on a server, such requests will be handled regarding information you gave us directly by phone or WhatsApp.',
        `Privacy inquiries: phone ${PHONE} · email ${EMAIL}.`,
      ] },
      { h: 'Updates', p: [
        'We may update this policy from time to time. The updated version will be posted on this page with its date.',
      ] },
    ],

    a11yTitle: 'Accessibility Statement',
    a11yUpdated: `Updated: ${UPDATED_EN}`,
    a11y: [
      { h: 'Our commitment', p: [
        'A.M. Filters is committed to equal, accessible service for all visitors, including people with disabilities. We work to make the Site accessible per Israeli Standard IS 5568 (based on WCAG 2.0 Level AA) and the Equal Rights for Persons with Disabilities (Service Accessibility) Regulations, 2013.',
      ] },
      { h: 'What is accessible', p: [
        'Full keyboard navigation with a clear visible focus indicator.',
        'Semantic HTML, hierarchical headings, and alternative text for meaningful images.',
        'ARIA labels for buttons and interactive components, including modals and the questionnaire.',
        'Full Hebrew and RTL support, and adequate color contrast.',
        'Respects the system reduced-motion preference (prefers-reduced-motion).',
      ] },
      { h: 'Accessibility menu', p: [
        'A persistent accessibility button (in the corner of the screen) opens a menu to: enlarge/reduce text size, high-contrast mode, highlight links, readable font, and pause animations. Your preferences are saved on your device.',
      ] },
      { h: 'Limitations', p: [
        'Some third-party components or content (such as the linked Midrag site) may not be fully under our control. We continue to improve accessibility on an ongoing basis.',
      ] },
      { h: 'Accessibility contact', p: [
        `Encountered an accessibility issue? We’re happy to help. The accessibility coordinator is available at ${PHONE} or ${EMAIL}.`,
      ] },
    ],
  },
}
