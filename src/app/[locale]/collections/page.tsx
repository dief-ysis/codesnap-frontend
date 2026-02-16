"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Folder } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  snippetCount: number;
  createdAt: string;
}

export default function CollectionsPage() {
  const t = useTranslations("common");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    loadCollections();
  }, [user, authLoading, router]);

  async function loadCollections() {
    try {
      const res = await api.get("/collections");
      setCollections(res.data.collections);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/collections", {
        name: newName,
        description: newDesc || undefined,
      });
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      loadCollections();
    } catch {
      // silent
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Collections</h1>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-1 h-4 w-4" />
          {t("create")}
        </Button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 rounded-lg border border-border p-4 space-y-3">
          <Input
            id="collection-name"
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            id="collection-desc"
            label="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={!newName}>
              {t("save")}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
              {t("cancel")}
            </Button>
          </div>
        </form>
      )}

      {collections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Folder className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-2 text-muted">{t("noResults")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
            >
              <div>
                <h3 className="font-medium text-foreground">{col.name}</h3>
                {col.description && (
                  <p className="mt-1 text-sm text-muted">{col.description}</p>
                )}
              </div>
              <span className="text-sm text-muted">
                {col.snippetCount} snippet{col.snippetCount !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
