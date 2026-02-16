"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useClipboard } from "@/hooks/useClipboard";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import {
  Copy,
  Check,
  GitFork,
  Share2,
  Trash2,
  Edit,
  Code2,
  ArrowLeft,
} from "lucide-react";

interface Snippet {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
  visibility: string;
  shareSlug: string;
  forkedFromId?: string | null;
  userId: string;
  tags: { id: string; name: string }[];
  forksCount: number;
  user: { id: string; username: string; displayName?: string | null };
  createdAt: string;
}

export default function SnippetDetailPage() {
  const t = useTranslations("common");
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { copied, copy } = useClipboard();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const snippetId = params.id as string;
  const isOwner = user?.id === snippet?.userId;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/snippets/${snippetId}`);
        setSnippet(res.data.snippet);
      } catch (err: any) {
        setError(err.message || "Snippet not found");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [snippetId]);

  const handleDelete = async () => {
    if (!confirm("Delete this snippet?")) return;
    try {
      await api.delete(`/snippets/${snippetId}`);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFork = async () => {
    try {
      const res = await api.post(`/snippets/${snippetId}/fork`);
      router.push(`/snippets/${res.data.snippet.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/s/${snippet?.shareSlug}`;
    copy(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">{t("loading")}</p>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500">{error || t("error")}</p>
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
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
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {snippet.visibility.toLowerCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => copy(snippet.code)}>
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          {user && !isOwner && (
            <Button variant="secondary" size="sm" onClick={handleFork}>
              <GitFork className="mr-1 h-4 w-4" />
              Fork
            </Button>
          )}
          {isOwner && (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/snippets/${snippet.id}`)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </div>

      {snippet.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <span className="text-xs font-medium text-muted">{snippet.language}</span>
          <span className="text-xs text-muted">
            {snippet.code.split("\n").length} lines
          </span>
        </div>
        <pre className="overflow-x-auto bg-background p-4">
          <code className="text-sm text-foreground">{snippet.code}</code>
        </pre>
      </div>

      {snippet.forksCount > 0 && (
        <p className="mt-4 text-sm text-muted">
          <GitFork className="mr-1 inline h-4 w-4" />
          {snippet.forksCount} fork{snippet.forksCount > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
