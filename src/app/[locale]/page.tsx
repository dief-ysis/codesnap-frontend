import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Code2, ArrowRight, Globe } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Landing page with hero section, CTA buttons, and project branding. */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Code2 className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>

        <p className="mb-8 text-lg text-muted">
          {t("subtitle")}
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            <Globe className="h-4 w-4" />
            {t("exploreCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
