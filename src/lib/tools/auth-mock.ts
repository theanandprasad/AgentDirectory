// lib/tools/auth-mock.ts
// Mock authentication utilities for development until Module 1 is ready

export interface MockUser {
  id: string;
  email: string;
  role: 'vendor' | 'admin' | 'user';
}

export interface MockProfile {
  id: string;
  fullName: string;
  companyName: string | null;
  role: 'vendor' | 'admin' | 'user';
}

export interface MockAuthResponse {
  success: boolean;
  data?: {
    user: MockUser;
    profile: MockProfile;
    isValid: boolean;
  };
  error?: string;
  code?: string;
}

// Mock user validation response (successful)
export const mockUserValidation: MockAuthResponse = {
  success: true,
  data: {
    user: {
      id: "vendor-123",
      email: "vendor@example.com",
      role: "vendor"
    },
    profile: {
      id: "vendor-123",
      fullName: "John Doe",
      companyName: "TechCorp AI",
      role: "vendor"
    },
    isValid: true
  }
};

// Mock admin check response
export const mockAdminCheck: MockAuthResponse = {
  success: true,
  data: {
    user: {
      id: "admin-123",
      email: "admin@example.com", 
      role: "admin"
    },
    profile: {
      id: "admin-123",
      fullName: "Admin User",
      companyName: null,
      role: "admin"
    },
    isValid: true
  }
};

// Mock unauthorized response
export const mockUnauthorized: MockAuthResponse = {
  success: false,
  error: "Unauthorized access",
  code: "AUTH_REQUIRED"
};

// Mock function to simulate authentication check
export async function mockAuthCheck(requireAuth: boolean = true): Promise<MockAuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // For development, always return successful auth if required
  if (requireAuth) {
    return mockUserValidation;
  }
  
  return mockUnauthorized;
}

// Mock function to simulate admin check
export async function mockAdminAuthCheck(): Promise<MockAuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockAdminCheck;
}

// Helper to check if user is vendor
export function isVendor(authResponse: MockAuthResponse): boolean {
  return authResponse.success && authResponse.data?.user.role === 'vendor';
}

// Helper to check if user is admin
export function isAdmin(authResponse: MockAuthResponse): boolean {
  return authResponse.success && authResponse.data?.user.role === 'admin';
}

// Mock vendor data for tool submissions
export const mockVendors: MockProfile[] = [
  {
    id: "vendor-123",
    fullName: "John Doe",
    companyName: "TechCorp AI",
    role: "vendor"
  },
  {
    id: "vendor-456",
    fullName: "Jane Smith",
    companyName: "AI Solutions Inc",
    role: "vendor"
  },
  {
    id: "vendor-789",
    fullName: "Mike Johnson",
    companyName: "DataFlow Systems",
    role: "vendor"
  }
]; 