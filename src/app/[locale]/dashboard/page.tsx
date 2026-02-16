"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { SnippetCard } from "@/components/snippets/SnippetCard";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  code: string;
  shareSlug: string;
  tags: { id: string; name: string }[];
  forksCount: number;
  user: { username: string; displayName?: string | null };
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("common");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function load() {
      try {
        const res = await api.get("/snippets?limit=50");
        setSnippets(res.data.snippets);
      } catch {
        // handle silently
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {t("dashboard", { defaultMessage: "Dashboard" })}
        </h1>
        <Link href="/snippets/new">
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            {t("create")}
          </Button>
        </Link>
      </div>

      {snippets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">{t("noResults")}</p>
          <Link href="/snippets/new" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              {t("create")} snippet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
