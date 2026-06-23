# API and Integration Boundaries: شريك

## 1. Internal API

Next.js routes/server actions يجب أن تكون thin orchestration فوق command layer. لا business logic حساس في React components.

## 2. Public/Client Surface

لا API عامة في V1 إلا واجهات التطبيق المصادقة. أي approval link يجب أن يكون مصادقا ومربوطا بنطاق العميل والنسخة.

## 3. Server-Only Commands

راجع `identity-authentication-and-authorization.md`. هذه الأوامر لا تستدعى مباشرة من client SDK دون خادم.

## 4. Integrations Later

- Social publishing: boundary منفصل بعد V1.
- AI suggestions: boundary منفصل مع سياسة بيانات.
- Billing: boundary منفصل مع ledger reconciliation.

## 5. API Security

- validate inputs with Zod لاحقا.
- require tenant context.
- reject unknown state transitions.
- rate limit sensitive endpoints لاحقا.
- no service role in browser.

