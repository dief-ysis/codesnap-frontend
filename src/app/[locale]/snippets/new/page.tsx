"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LanguageSelect } from "@/components/editor/LanguageSelect";

export default function NewSnippetPage() {
  const t = useTranslations("common");
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [visibility, setVisibility] = useState<"PRIVATE" | "PUBLIC" | "UNLISTED">("PRIVATE");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/snippets", {
        title,
        description: description || undefined,
        code,
        language,
        visibility,
        tags: tags
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
      });
      router.push(`/snippets/${res.data.snippet.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create snippet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t("create")} Snippet</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="My awesome snippet"
        />

        <Input
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />

        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">Language</label>
            <LanguageSelect value={language} onChange={setLanguage} />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
            </select>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} language={language} />

        <Input
          id="tags"
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, hooks, typescript (comma-separated)"
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading || !title || !code}>
            {isLoading ? "..." : t("save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/dashboard")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
