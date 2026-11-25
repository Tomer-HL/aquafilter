# עריכת תוכן האתר (Decap CMS)

מסך העריכה: **https://aquafilter-gold.vercel.app/admin/** (עם סלאש בסוף)

## לאיציק, איך משנים טקסט
1. נכנסים לכתובת למעלה ולוחצים **Login with GitHub** ומתחברים עם חשבון GitHub.
2. בוחרים **תוכן האתר ← עברית** (או English).
3. פותחים את הקבוצה הרצויה (למשל "אזור הפתיחה"), משנים את הטקסט.
4. לוחצים **פרסום ← פרסם עכשיו**. האתר מתעדכן תוך כדקה.
5. טעות? ב-GitHub ← History אפשר לחזור לגרסה קודמת (או לבקש מתומר).

עורכים רק את הטקסטים. עיצוב, תמונות וקישורי פנים לא נערכים כאן. שדות שמסומנים "(לא לשנות)" הם נתיבים טכניים.

## הקמה חד-פעמית (תומר)
1. ב-GitHub: Settings ← Developer settings ← OAuth Apps ← New OAuth App
   - Homepage URL: `https://aquafilter-gold.vercel.app`
   - Authorization callback URL: `https://aquafilter-gold.vercel.app/api/callback`
   - אחרי היצירה: Generate a new client secret.
2. ב-Vercel ← הפרויקט ← Settings ← Environment Variables (Production), להוסיף:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   ואז Redeploy. אין לשמור את הערכים האלה בקוד.
3. בריפו `Tomer-HL/aquafilter`: Settings ← Collaborators ← להזמין את איציק עם הרשאת **Write** (הוא צריך חשבון GitHub).
4. אם מחברים דומיין אמיתי: לעדכן `base_url` ו-`site_url` ב-`scripts/build-cms.mjs`, להריץ `node scripts/build-cms.mjs`, ולעדכן גם את כתובת ה-OAuth App.

## איך זה בנוי
- הטקסטים הניתנים לעריכה: `content/he.json` ו-`content/en.json`. הם ממוזגים מעל ברירות המחדל שבקוד (`src/i18n.defaults.js`), שם נשארות גם הפונקציות (למשל טקסט הביקורות).
- הגדרת השדות: `public/admin/config.yml`, נוצרת אוטומטית על ידי `node scripts/build-cms.mjs`. אם מוסיפים טקסט חדש ל-`i18n.defaults.js`, מריצים את הסקריפט מחדש (הוא לא דורס את קבצי ה-JSON שכבר קיימים, כדי לא למחוק עריכות של איציק; `--reset` בונה אותם מחדש מברירות המחדל).
- כניסה: GitHub OAuth דרך `api/auth.js` ו-`api/callback.js`. ההרשאה לשמור נקבעת לפי הרשאות הכתיבה בריפו, כך שמי שאין לו הרשאה לא יכול לשנות.
