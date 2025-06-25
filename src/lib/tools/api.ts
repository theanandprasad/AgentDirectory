// lib/tools/api.ts
// API utility functions for the Tool Directory module

import { 
  Tool, 
  ToolWithRelations, 
  Category, 
  UseCase, 
  ToolSubmissionData,
  ToolFilters,
  SearchResult,
  PaginationData,
  ToolListResponse,
  VendorToolsResponse,
  CategoriesResponse
} from './types';

const API_BASE = '/api/tools';

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `API error: ${response.status}`);
  }
  return response.json();
}

// Get all tools with filtering and pagination
export async function getTools(filters: ToolFilters = {}): Promise<ToolListResponse> {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.useCases?.length) {
    filters.useCases.forEach(useCase => params.append('useCases', useCase));
  }
  if (filters.search) params.append('search', filters.search);
  if (filters.pricingModel?.length) {
    filters.pricingModel.forEach(model => params.append('pricingModel', model));
  }
  if (filters.integrationDifficulty?.length) {
    filters.integrationDifficulty.forEach(diff => params.append('integrationDifficulty', diff.toString()));
  }
  
  const response = await fetch(`${API_BASE}?${params.toString()}`);
  return handleApiResponse<ToolListResponse>(response);
}

// Get a specific tool by ID or slug
export async function getTool(idOrSlug: string): Promise<{ success: true; data: ToolWithRelations }> {
  const response = await fetch(`${API_BASE}/${idOrSlug}`);
  return handleApiResponse<{ success: true; data: ToolWithRelations }>(response);
}

// Submit a new tool (requires authentication)
export async function submitTool(toolData: ToolSubmissionData): Promise<{ success: true; data: Tool; message: string }> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add real auth header when Module 1 is ready
      'Authorization': 'Bearer mock-token'
    },
    body: JSON.stringify(toolData)
  });
  return handleApiResponse<{ success: true; data: Tool; message: string }>(response);
}

// Update an existing tool (requires authentication)
export async function updateTool(toolId: string, toolData: Partial<ToolSubmissionData>): Promise<{ success: true; data: Tool }> {
  const response = await fetch(`${API_BASE}/${toolId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-token'
    },
    body: JSON.stringify(toolData)
  });
  return handleApiResponse<{ success: true; data: Tool }>(response);
}

// Delete a tool (requires authentication)
export async function deleteTool(toolId: string): Promise<{ success: true; message: string }> {
  const response = await fetch(`${API_BASE}/${toolId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer mock-token'
    }
  });
  return handleApiResponse<{ success: true; message: string }>(response);
}

// Search tools
export async function searchTools(query: string, filters: Partial<ToolFilters> = {}): Promise<{ success: true; data: SearchResult }> {
  const params = new URLSearchParams();
  params.append('q', query);
  
  if (filters.category) params.append('category', filters.category);
  if (filters.useCases?.length) {
    filters.useCases.forEach(useCase => params.append('useCases', useCase));
  }
  
  const response = await fetch(`${API_BASE}/search?${params.toString()}`);
  return handleApiResponse<{ success: true; data: SearchResult }>(response);
}

// Get all categories with use cases and tool counts
export async function getCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${API_BASE}/categories`);
  return handleApiResponse<CategoriesResponse>(response);
}

// Get vendor's tools (requires authentication)
export async function getVendorTools(vendorId: string): Promise<VendorToolsResponse> {
  const response = await fetch(`${API_BASE}/vendor/${vendorId}`, {
    headers: {
      'Authorization': 'Bearer mock-token'
    }
  });
  return handleApiResponse<VendorToolsResponse>(response);
}

// Increment tool view count
export async function incrementToolViews(toolId: string): Promise<{ success: true }> {
  const response = await fetch(`${API_BASE}/${toolId}/views`, {
    method: 'POST'
  });
  return handleApiResponse<{ success: true }>(response);
}

// Helper function to generate tool slug from name
export function generateToolSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to format pricing model for display
export function formatPricingModel(pricingModel: Tool['pricingModel']): string {
  switch (pricingModel) {
    case 'free':
      return 'Free';
    case 'freemium':
      return 'Freemium';
    case 'paid':
      return 'Paid';
    case 'custom':
      return 'Custom Pricing';
    default:
      return 'Unknown';
  }
}

// Helper function to format integration difficulty
export function formatIntegrationDifficulty(difficulty: number): string {
  const labels = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Moderate',
    4: 'Hard',
    5: 'Very Hard'
  };
  return labels[difficulty as keyof typeof labels] || 'Unknown';
}

// Helper function to get difficulty color class
export function getDifficultyColorClass(difficulty: number): string {
  const colors = {
    1: 'text-green-600 bg-green-50',
    2: 'text-green-500 bg-green-50',
    3: 'text-yellow-600 bg-yellow-50',
    4: 'text-orange-600 bg-orange-50',
    5: 'text-red-600 bg-red-50'
  };
  return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-50';
} 