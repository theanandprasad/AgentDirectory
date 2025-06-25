// app/api/tools/categories/route.ts
// Categories API endpoint - GET all categories with use cases and tool counts

import { NextRequest, NextResponse } from 'next/server';

// Mock data for development (will be replaced with database queries)
const mockCategories = [
  { id: 'cat-1', name: 'Sales', slug: 'sales', description: 'Tools for sales teams and revenue generation', icon: 'TrendingUp', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Marketing', slug: 'marketing', description: 'Marketing automation and campaign management', icon: 'Megaphone', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Customer Success', slug: 'customer-success', description: 'Customer support and success tools', icon: 'Users', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Human Resources', slug: 'hr', description: 'HR management and employee tools', icon: 'UserCheck', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Finance', slug: 'finance', description: 'Financial planning and accounting tools', icon: 'DollarSign', createdAt: '2024-01-01T00:00:00Z' }
];

const mockUseCases = [
  // Sales use cases
  { id: 'uc-1', name: 'Lead Generation', slug: 'lead-generation', categoryId: 'cat-1', description: 'Find and qualify potential customers', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-2', name: 'CRM Management', slug: 'crm-management', categoryId: 'cat-1', description: 'Manage customer relationships', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-3', name: 'Sales Analytics', slug: 'sales-analytics', categoryId: 'cat-1', description: 'Track and analyze sales performance', createdAt: '2024-01-01T00:00:00Z' },
  
  // Marketing use cases
  { id: 'uc-4', name: 'Email Marketing', slug: 'email-marketing', categoryId: 'cat-2', description: 'Email campaign automation', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-5', name: 'Social Media', slug: 'social-media', categoryId: 'cat-2', description: 'Social media management', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-6', name: 'Content Creation', slug: 'content-creation', categoryId: 'cat-2', description: 'Create marketing content', createdAt: '2024-01-01T00:00:00Z' },
  
  // Customer Success use cases
  { id: 'uc-7', name: 'Help Desk', slug: 'help-desk', categoryId: 'cat-3', description: 'Customer support ticketing', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-8', name: 'Live Chat', slug: 'live-chat', categoryId: 'cat-3', description: 'Real-time customer chat', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-9', name: 'Knowledge Base', slug: 'knowledge-base', categoryId: 'cat-3', description: 'Self-service documentation', createdAt: '2024-01-01T00:00:00Z' },
  
  // HR use cases
  { id: 'uc-10', name: 'Recruiting', slug: 'recruiting', categoryId: 'cat-4', description: 'Talent acquisition and hiring', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-11', name: 'Performance Management', slug: 'performance-management', categoryId: 'cat-4', description: 'Employee performance tracking', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-12', name: 'Payroll', slug: 'payroll', categoryId: 'cat-4', description: 'Payroll and benefits management', createdAt: '2024-01-01T00:00:00Z' },
  
  // Finance use cases
  { id: 'uc-13', name: 'Accounting', slug: 'accounting', categoryId: 'cat-5', description: 'Financial record keeping', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-14', name: 'Invoicing', slug: 'invoicing', categoryId: 'cat-5', description: 'Invoice generation and management', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'uc-15', name: 'Expense Management', slug: 'expense-management', categoryId: 'cat-5', description: 'Track and manage expenses', createdAt: '2024-01-01T00:00:00Z' }
];

// Mock tool counts by category (in real implementation, this would be a database query)
const mockToolCounts = {
  'cat-1': 1, // Sales
  'cat-2': 1, // Marketing  
  'cat-3': 1, // Customer Success
  'cat-4': 0, // HR
  'cat-5': 0  // Finance
};

// GET /api/tools/categories - Get all categories with use cases and tool counts
export async function GET(request: NextRequest) {
  try {
    // Build categories with use cases and tool counts
    const categoriesWithData = mockCategories.map(category => {
      const useCases = mockUseCases.filter(useCase => useCase.categoryId === category.id);
      const toolCount = mockToolCounts[category.id as keyof typeof mockToolCounts] || 0;
      
      return {
        ...category,
        useCases,
        toolCount
      };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithData
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 