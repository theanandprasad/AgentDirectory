// lib/tools/types.ts
// TypeScript types for the Tool Directory module

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
}

export interface UseCase {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string | null;
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  
  // Categorization
  primaryCategoryId: string;
  useCaseIds: string[];
  
  // Vendor
  vendorId: string;
  vendorContactEmail: string | null;
  
  // Details
  pricingModel: 'free' | 'freemium' | 'paid' | 'custom';
  pricingDetails: string | null;
  integrationDifficulty: 1 | 2 | 3 | 4 | 5;
  
  // Metadata
  approved: boolean;
  featured: boolean;
  viewCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface ToolWithRelations extends Tool {
  category: Category;
  useCases: UseCase[];
  vendor: {
    id: string;
    fullName: string;
    companyName: string | null;
  };
}

export interface ToolFilters {
  category?: string;
  useCases?: string[];
  search?: string;
  pricingModel?: string[];
  integrationDifficulty?: number[];
}

export interface SearchResult {
  tools: Tool[];
  suggestions: string[];
  totalResults: number;
}

export interface ToolSubmissionData {
  name: string;
  description: string;
  longDescription?: string;
  websiteUrl: string;
  logoUrl?: string;
  primaryCategoryId: string;
  useCaseIds: string[];
  pricingModel: 'free' | 'freemium' | 'paid' | 'custom';
  pricingDetails?: string;
  integrationDifficulty: 1 | 2 | 3 | 4 | 5;
  vendorContactEmail?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ToolListResponse {
  success: true;
  data: {
    tools: Tool[];
    pagination: PaginationData;
  };
}

export interface VendorToolsResponse {
  success: true;
  data: {
    tools: Tool[];
    totalTools: number;
    approvedTools: number;
    pendingTools: number;
  };
}

export interface CategoriesResponse {
  success: true;
  data: {
    categories: (Category & {
      useCases: UseCase[];
      toolCount: number;
    })[];
  };
} 