"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Code2 } from "lucide-react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({
        email: form.email,
        username: form.username,
        password: form.password,
        displayName: form.displayName || undefined,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Code2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            {t("registerTitle")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <Input
            id="email"
            type="email"
            label={t("email")}
            value={form.email}
            onChange={update("email")}
            required
            autoComplete="email"
          />

          <Input
            id="username"
            label={t("username")}
            value={form.username}
            onChange={update("username")}
            required
            autoComplete="username"
          />

          <Input
            id="password"
            type="password"
            label={t("password")}
            value={form.password}
            onChange={update("password")}
            required
            minLength={8}
            autoComplete="new-password"
          />

          <Input
            id="displayName"
            label={t("displayName")}
            value={form.displayName}
            onChange={update("displayName")}
            autoComplete="name"
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "..." : t("registerButton")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          {t("hasAccount")}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
