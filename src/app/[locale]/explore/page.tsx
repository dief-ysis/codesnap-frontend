"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { SnippetCard } from "@/components/snippets/SnippetCard";
import { Input } from "@/components/ui/Input";
import { LanguageSelect } from "@/components/editor/LanguageSelect";
import { Search } from "lucide-react";

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

export default function ExplorePage() {
  const t = useTranslations("common");
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSnippets = useCallback(async () => {
    setIsLoading(true);
    try {
      let endpoint = "/snippets/public?limit=30";
      if (query) {
        endpoint = `/snippets/search?q=${encodeURIComponent(query)}&limit=30`;
      }
      if (language) {
        endpoint += `&language=${encodeURIComponent(language)}`;
      }
      const res = await api.get(endpoint);
      setSnippets(res.data.snippets);
    } catch {
      setSnippets([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, language]);

  useEffect(() => {
    const timer = setTimeout(fetchSnippets, 300);
    return () => clearTimeout(timer);
  }, [fetchSnippets]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {t("search", { defaultMessage: "Explore" })}
      </h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${t("search")}...`}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All languages</option>
            {[
              "javascript", "typescript", "python", "java", "go", "rust",
              "ruby", "php", "css", "html", "sql", "bash",
            ].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-muted">{t("loading")}</p>
        </div>
      ) : snippets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">{t("noResults")}</p>
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
