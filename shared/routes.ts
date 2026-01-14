
import { z } from 'zod';
import { insertAppSchema, apps, CATEGORIES } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  apps: {
    list: {
      method: 'GET' as const,
      path: '/api/apps',
      input: z.object({
        search: z.string().optional(),
        category: z.enum(CATEGORIES).optional(),
        sort: z.enum(['newest', 'rating', 'popular']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof apps.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/apps/:id',
      responses: {
        200: z.custom<typeof apps.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/apps',
      input: insertAppSchema,
      responses: {
        201: z.custom<typeof apps.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    rate: {
      method: 'POST' as const,
      path: '/api/apps/:id/rate',
      input: z.object({ rating: z.number().min(1).max(5) }),
      responses: {
        200: z.custom<typeof apps.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    scrape: {
      method: 'POST' as const,
      path: '/api/scrape',
      input: z.object({ url: z.string().url() }),
      responses: {
        200: z.object({
          name: z.string(),
          description: z.string(),
          iconUrl: z.string().optional()
        }),
        400: errorSchemas.validation,
      }
    }
  },
  admin: {
    login: {
      method: 'POST' as const,
      path: '/api/admin/login',
      input: z.object({ password: z.string() }),
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
