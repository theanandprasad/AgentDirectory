// app/api/tools/route.ts
// Main tools API endpoint - GET all tools, POST new tool

import { NextRequest, NextResponse } from 'next/server';
import { mockAuthCheck, isVendor, mockVendors } from '@/lib/tools/auth-mock';
import { generateToolSlug } from '@/lib/tools/api';

// Mock data for development
const mockCategories = [
  { id: 'cat-1', name: 'Sales', slug: 'sales', description: 'Tools for sales teams and revenue generation', icon: 'TrendingUp' },
  { id: 'cat-2', name: 'Marketing', slug: 'marketing', description: 'Marketing automation and campaign management', icon: 'Megaphone' },
  { id: 'cat-3', name: 'Customer Success', slug: 'customer-success', description: 'Customer support and success tools', icon: 'Users' },
  { id: 'cat-4', name: 'Human Resources', slug: 'hr', description: 'HR management and employee tools', icon: 'UserCheck' },
  { id: 'cat-5', name: 'Finance', slug: 'finance', description: 'Financial planning and accounting tools', icon: 'DollarSign' }
];

const mockUseCases = [
  { id: 'uc-1', name: 'Lead Generation', slug: 'lead-generation', categoryId: 'cat-1' },
  { id: 'uc-2', name: 'CRM Management', slug: 'crm-management', categoryId: 'cat-1' },
  { id: 'uc-3', name: 'Email Marketing', slug: 'email-marketing', categoryId: 'cat-2' },
  { id: 'uc-4', name: 'Social Media', slug: 'social-media', categoryId: 'cat-2' },
  { id: 'uc-5', name: 'Help Desk', slug: 'help-desk', categoryId: 'cat-3' }
];

// Mock tools data
let mockTools = [
  {
    id: 'tool-1',
    name: 'SalesForce CRM',
    slug: 'salesforce-crm',
    description: 'Comprehensive CRM solution for sales teams',
    longDescription: 'A powerful customer relationship management platform that helps sales teams manage leads, track opportunities, and close more deals.',
    websiteUrl: 'https://salesforce.com',
    logoUrl: 'https://via.placeholder.com/100x100?text=SF',
    primaryCategoryId: 'cat-1',
    useCaseIds: ['uc-1', 'uc-2'],
    vendorId: 'vendor-123',
    vendorContactEmail: 'vendor@salesforce.com',
    pricingModel: 'paid' as const,
    pricingDetails: 'Starting at $25/user/month',
    integrationDifficulty: 3,
    approved: true,
    featured: true,
    viewCount: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'tool-2',
    name: 'HubSpot Marketing',
    slug: 'hubspot-marketing',
    description: 'All-in-one marketing automation platform',
    longDescription: 'Complete marketing automation platform with email marketing, social media management, and lead nurturing capabilities.',
    websiteUrl: 'https://hubspot.com',
    logoUrl: 'https://via.placeholder.com/100x100?text=HUB',
    primaryCategoryId: 'cat-2',
    useCaseIds: ['uc-3', 'uc-4'],
    vendorId: 'vendor-456',
    vendorContactEmail: 'vendor@hubspot.com',
    pricingModel: 'freemium' as const,
    pricingDetails: 'Free tier available, paid plans start at $50/month',
    integrationDifficulty: 2,
    approved: true,
    featured: false,
    viewCount: 890,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'tool-3',
    name: 'Zendesk Support',
    slug: 'zendesk-support',
    description: 'Customer support and help desk software',
    longDescription: 'Modern customer service software that helps teams provide better customer experiences.',
    websiteUrl: 'https://zendesk.com',
    logoUrl: 'https://via.placeholder.com/100x100?text=ZD',
    primaryCategoryId: 'cat-3',
    useCaseIds: ['uc-5'],
    vendorId: 'vendor-789',
    vendorContactEmail: 'vendor@zendesk.com',
    pricingModel: 'paid' as const,
    pricingDetails: 'Starting at $19/agent/month',
    integrationDifficulty: 2,
    approved: true,
    featured: false,
    viewCount: 567,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  }
];

// GET /api/tools - List all approved tools with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const useCases = searchParams.getAll('useCases');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Filter tools
    let filteredTools = mockTools.filter(tool => tool.approved);
    
    if (category) {
      const categoryObj = mockCategories.find(cat => cat.slug === category);
      if (categoryObj) {
        filteredTools = filteredTools.filter(tool => tool.primaryCategoryId === categoryObj.id);
      }
    }
    
    if (useCases.length > 0) {
      const useCaseObjects = mockUseCases.filter(uc => useCases.includes(uc.slug));
      const useCaseIds = useCaseObjects.map(uc => uc.id);
      filteredTools = filteredTools.filter(tool => 
        tool.useCaseIds.some(ucId => useCaseIds.indexOf(ucId) !== -1)
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().indexOf(searchLower) !== -1 ||
        tool.description.toLowerCase().indexOf(searchLower) !== -1
      );
    }
    
    if (featured) {
      filteredTools = filteredTools.filter(tool => tool.featured);
    }
    
    // Pagination
    const total = filteredTools.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedTools = filteredTools.slice(offset, offset + limit);
    
    return NextResponse.json({
      success: true,
      data: {
        tools: paginatedTools,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST /api/tools - Submit new tool (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await mockAuthCheck(true);
    if (!authResponse.success || !isVendor(authResponse)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.description || !body.websiteUrl || !body.primaryCategoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new tool
    const newTool = {
      id: `tool-${Date.now()}`,
      name: body.name,
      slug: generateToolSlug(body.name),
      description: body.description,
      longDescription: body.longDescription || null,
      websiteUrl: body.websiteUrl,
      logoUrl: body.logoUrl || null,
      primaryCategoryId: body.primaryCategoryId,
      useCaseIds: body.useCaseIds || [],
      vendorId: authResponse.data!.user.id,
      vendorContactEmail: body.vendorContactEmail || null,
      pricingModel: body.pricingModel || 'custom',
      pricingDetails: body.pricingDetails || null,
      integrationDifficulty: body.integrationDifficulty || 3,
      approved: false, // New tools require approval
      featured: false,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to mock data
    mockTools.push(newTool);
    
    return NextResponse.json({
      success: true,
      data: newTool,
      message: 'Tool submitted for approval'
    });
  } catch (error) {
    console.error('Error submitting tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit tool' },
      { status: 500 }
    );
  }
} 