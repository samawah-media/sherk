# Deployment, Environments and Secrets: شريك

## 1. Environments

| Environment | الغرض |
| --- | --- |
| local | تطوير فردي |
| preview | مراجعة تغييرات |
| staging | اختبار قريب من production |
| production | تشغيل العملاء |

## 2. Secrets

- أسرار منفصلة لكل بيئة.
- لا توضع secret/service keys في `NEXT_PUBLIC_*`.
- rotate عند مغادرة مسؤول أو شك في التسرب.
- CI لا يطبع الأسرار في logs.

## 3. Deployment

يفضل Vercel أو منصة متوافقة مع Next.js. Supabase project مستقل للـproduction. Preview environments يجب ألا تستخدم بيانات Production حقيقية.

## 4. Release Controls

- migrations لاحقا بعد Specs.
- feature flags للميزات الحساسة عند الحاجة.
- rollback plan لكل release.
- smoke tests للـauth والعزل والعمليات الحساسة.

