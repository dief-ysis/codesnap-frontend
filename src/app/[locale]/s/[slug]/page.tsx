"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useClipboard } from "@/hooks/useClipboard";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Copy, Check, Code2 } from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
  visibility: string;
  tags: { id: string; name: string }[];
  user: { username: string; displayName?: string | null };
  createdAt: string;
}

/** Read-only public page for viewing a snippet via its unique share slug URL. */
export default function SharedSnippetPage() {
  const t = useTranslations("common");
  const params = useParams();
  const { copied, copy } = useClipboard();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const slug = params.slug as string;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/snippets/share/${slug}`);
        setSnippet(res.data.snippet);
      } catch (err: any) {
        setError(err.message || "Snippet not found");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">{t("loading")}</p>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">{error || "Snippet not found"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{snippet.title}</h1>
        {snippet.description && (
          <p className="mt-1 text-muted">{snippet.description}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-sm text-muted">
          <span>@{snippet.user.username}</span>
          <span className="flex items-center gap-1">
            <Code2 className="h-3 w-3" />
            {snippet.language}
          </span>
        </div>
      </div>

      {snippet.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <span key={tag.id} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <span className="text-xs font-medium text-muted">{snippet.language}</span>
          <Button variant="ghost" size="sm" onClick={() => copy(snippet.code)}>
            {copied ? (
              <>
                <Check className="mr-1 h-4 w-4 text-green-500" />
                {t("copied")}
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" />
                {t("copyCode")}
              </>
            )}
          </Button>
        </div>
        <pre className="overflow-x-auto bg-background p-4">
          <code className="text-sm text-foreground">{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
