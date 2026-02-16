"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { SnippetCard } from "@/components/snippets/SnippetCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2, Edit } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  snippets: any[];
}

/** Collection detail page showing contained snippets with per-snippet removal. */
export default function CollectionDetailPage() {
  const t = useTranslations("common");
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const collectionId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }

    async function load() {
      try {
        const res = await api.get(`/collections/${collectionId}`);
        setCollection(res.data.collection);
      } catch (err: any) {
        setError(err.message || "Collection not found");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [collectionId, user, authLoading, router]);

  const handleDelete = async () => {
    if (!confirm("Delete this collection?")) return;
    try {
      await api.delete(`/collections/${collectionId}`);
      router.push("/collections");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveSnippet = async (snippetId: string) => {
    try {
      await api.delete(`/collections/${collectionId}/snippets/${snippetId}`);
      // Optimistic-style local state update: remove the snippet from the UI
      // immediately after the API confirms deletion, avoiding a full re-fetch.
      setCollection((prev) =>
        prev
          ? { ...prev, snippets: prev.snippets.filter((s) => s.id !== snippetId) }
          : null
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">{t("loading")}</p>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500">{error || t("error")}</p>
        <Button variant="ghost" onClick={() => router.push("/collections")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/collections")} className="mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("back")}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
          {collection.description && (
            <p className="mt-1 text-muted">{collection.description}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {collection.snippets.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-muted">{t("noResults")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collection.snippets.map((snippet: any) => (
            <div key={snippet.id} className="relative">
              <SnippetCard snippet={snippet} />
              <button
                onClick={() => handleRemoveSnippet(snippet.id)}
                className="absolute right-2 top-2 rounded-md bg-surface p-1 text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                title="Remove from collection"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
