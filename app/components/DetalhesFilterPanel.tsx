"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterPanel } from "./FilterPanel";
import type { FilterOptions, FilterState } from "../lib/calc";
import { DEFAULT_FILTERS } from "../lib/calc";

type Props = {
  options: FilterOptions;
};

export function DetalhesFilterPanel({ options }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters: FilterState = {
    cliente: searchParams.get("cliente") ?? DEFAULT_FILTERS.cliente,
    projeto: searchParams.get("projeto") ?? DEFAULT_FILTERS.projeto,
    area: searchParams.get("area") ?? DEFAULT_FILTERS.area,
    senioridade: searchParams.get("senioridade") ?? DEFAULT_FILTERS.senioridade,
    tribo: searchParams.get("tribo") ?? DEFAULT_FILTERS.tribo,
    lider: searchParams.get("lider") ?? DEFAULT_FILTERS.lider,
    data: searchParams.get("data") ?? DEFAULT_FILTERS.data,
  };

  function handleApply(filters: FilterState) {
    const params = new URLSearchParams();

    // Preserve colaborador and vencer if present
    const colaborador = searchParams.get("colaborador");
    const vencer = searchParams.get("vencer");
    if (colaborador) params.set("colaborador", colaborador);
    if (vencer) params.set("vencer", vencer);

    // Apply new filters (skip defaults)
    if (filters.cliente !== DEFAULT_FILTERS.cliente) params.set("cliente", filters.cliente);
    if (filters.projeto !== DEFAULT_FILTERS.projeto) params.set("projeto", filters.projeto);
    if (filters.area !== DEFAULT_FILTERS.area) params.set("area", filters.area);
    if (filters.senioridade !== DEFAULT_FILTERS.senioridade) params.set("senioridade", filters.senioridade);
    if (filters.tribo !== DEFAULT_FILTERS.tribo) params.set("tribo", filters.tribo);
    if (filters.data) params.set("data", filters.data);

    const qs = params.toString();
    router.push(`/detalhes${qs ? `?${qs}` : ""}`);
  }

  return (
    <FilterPanel
      options={options}
      onApply={handleApply}
      initialFilters={initialFilters}
    />
  );
}
