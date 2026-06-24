export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section dir="rtl" className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 py-3">
        <nav aria-label="تنقل بوابة العميل" className="flex gap-4 text-sm">
          <a className="font-medium" href="/client">
            الرئيسية
          </a>
          <a className="font-medium" href="/client">
            بانتظار موافقتي
          </a>
        </nav>
      </header>
      {children}
    </section>
  );
}
