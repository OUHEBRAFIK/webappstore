import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateAppRequest, type RateAppRequest, type ScrapeRequest, type AdminLoginRequest } from @shared/routes";
import { CATEGORIES } from @shared/schema";

// Helper to construct query strings
function buildQueryString(params: Record<string, any>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

// GET /api/apps - List with filters
export function useApps(filters: { search?: string; category?: string; sort?: string } = {}) {
  const queryKey = [api.apps.list.path, filters];
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Validate category against schema enum
      const validCategory = filters.category && CATEGORIES.includes(filters.category as any) 
        ? filters.category 
        : undefined;
        
      const queryString = buildQueryString({ ...filters, category: validCategory });
      const url = `${api.apps.list.path}?${queryString}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch apps");
      return api.apps.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/apps - Create new app
export function useCreateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAppRequest) => {
      const res = await fetch(api.apps.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit app");
      }
      return api.apps.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
    },
  });
}

// POST /api/apps/:id/rate - Rate an app
export function useRateApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, rating }: { id: number } & RateAppRequest) => {
      const url = buildUrl(api.apps.rate.path, { id });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to rate app");
      return api.apps.rate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
    },
  });
}

// POST /api/scrape - Scrape metadata
export function useScrapeApp() {
  return useMutation({
    mutationFn: async (data: ScrapeRequest) => {
      const res = await fetch(api.apps.scrape.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to scrape URL");
      }
      return api.apps.scrape.responses[200].parse(await res.json());
    },
  });
}

// POST /api/admin/login
export function useAdminLogin() {
  return useMutation({
    mutationFn: async (data: AdminLoginRequest) => {
      const res = await fetch(api.admin.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Invalid password");
      return api.admin.login.responses[200].parse(await res.json());
    }
  });
}
