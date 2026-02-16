"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useClipboard } from "@/hooks/useClipboard";
import { Code2, Copy, Check, GitFork } from "lucide-react";

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

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  const t = useTranslations("common");
  const { copied, copy } = useClipboard();
  const preview = snippet.code.split("\n").slice(0, 5).join("\n");

  return (
    <div className="group rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/30">
      <div className="mb-3 flex items-start justify-between">
        <Link href={`/snippets/${snippet.id}`} className="flex-1">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
            {snippet.title}
          </h3>
          {snippet.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {snippet.description}
            </p>
          )}
        </Link>
        <button
          onClick={() => copy(snippet.code)}
          className="ml-2 rounded-md p-1.5 text-muted transition-colors hover:text-primary"
          title={t("copyCode")}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <pre className="mb-3 overflow-hidden rounded-md bg-background p-3 text-xs">
        <code className="text-muted">{preview}</code>
      </pre>

      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Code2 className="h-3 w-3" />
            {snippet.language}
          </span>
          {snippet.forksCount > 0 && (
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {snippet.forksCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {snippet.tags.slice(0, 3).map((tag) => (
            <span key={tag.id} className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
