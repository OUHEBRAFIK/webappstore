
import { z } from 'zod';
import { insertAppSchema, insertReviewSchema, apps, reviews, CATEGORIES } from './schema.js';

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
        200: z.custom<typeof apps.$inferSelect & { reviews: (typeof reviews.$inferSelect)[] }>(),
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
  reviews: {
    create: {
      method: 'POST' as const,
      path: '/api/apps/:id/reviews',
      input: insertReviewSchema.omit({ appId: true }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
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
