// lib/tools/validation.ts
// Zod validation schemas for the Tool Directory module

import { z } from 'zod';

export const toolSubmissionSchema = z.object({
  name: z.string().min(2, 'Tool name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  websiteUrl: z.string().url('Invalid website URL'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  primaryCategoryId: z.string().uuid('Invalid category'),
  useCaseIds: z.array(z.string().uuid()).min(1, 'Select at least one use case'),
  pricingModel: z.enum(['free', 'freemium', 'paid', 'custom']),
  pricingDetails: z.string().optional(),
  integrationDifficulty: z.number().int().min(1).max(5),
  vendorContactEmail: z.string().email().optional(),
});

export const toolSearchSchema = z.object({
  q: z.string().min(1, 'Search query required'),
  category: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(50).default(20),
});

export const toolFiltersSchema = z.object({
  category: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
  featured: z.boolean().optional(),
  pricingModel: z.array(z.enum(['free', 'freemium', 'paid', 'custom'])).optional(),
  integrationDifficulty: z.array(z.number().int().min(1).max(5)).optional(),
});

export const toolUpdateSchema = toolSubmissionSchema.partial();

// Validation for URL parameters
export const toolSlugSchema = z.object({
  slug: z.string().min(1, 'Tool slug is required'),
});

export const categorySlugSchema = z.object({
  category: z.string().min(1, 'Category slug is required'),
});

export const vendorIdSchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID'),
});

// Validation for search suggestions
export const searchSuggestionSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  limit: z.number().int().min(1).max(10).default(5),
});

export type ToolSubmissionData = z.infer<typeof toolSubmissionSchema>;
export type ToolSearchData = z.infer<typeof toolSearchSchema>;
export type ToolFiltersData = z.infer<typeof toolFiltersSchema>;
export type ToolUpdateData = z.infer<typeof toolUpdateSchema>; 