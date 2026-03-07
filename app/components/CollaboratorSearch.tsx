"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
  collaborators?: string[];
};

export function CollaboratorSearch({ collaborators = [] }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestions = query.trim()
    ? collaborators.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(name: string) {
    setQuery(name);
    setOpen(false);
    router.push(`/detalhes?colaborador=${encodeURIComponent(name)}`);
  }

  return (
    <div ref={ref} className="relative flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query && setOpen(true)}
        placeholder="Pesquisar por colaborador"
        className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-transparent text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
      />

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
          {suggestions.map((name) => (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <Search size={13} className="text-gray-400 shrink-0" />
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
