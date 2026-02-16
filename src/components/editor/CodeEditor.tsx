"use client";

import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "Paste or write your code here...",
}: CodeEditorProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
        <span className="text-xs font-medium text-muted">{language}</span>
        <span className="text-xs text-muted">
          {value.split("\n").length} lines
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none bg-background p-4 font-mono text-sm text-foreground",
          "placeholder:text-muted focus:outline-none",
          "min-h-[300px]"
        )}
        spellCheck={false}
      />
    </div>
  );
}
