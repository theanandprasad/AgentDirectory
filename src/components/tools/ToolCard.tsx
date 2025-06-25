// components/tools/ToolCard.tsx
// Tool display card component for showing tool information

import Link from 'next/link';
import Image from 'next/image';
import { Tool, Category } from '@/lib/tools/types';
import { formatPricingModel, formatIntegrationDifficulty, getDifficultyColorClass } from '@/lib/tools/api';

interface ToolCardProps {
  tool: Tool;
  category: Category;
  showVendor?: boolean;
  variant?: 'grid' | 'list';
}

export function ToolCard({ tool, category, showVendor = true, variant = 'grid' }: ToolCardProps) {
  const isGrid = variant === 'grid';
  
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white ${
      isGrid ? 'h-full' : 'flex'
    }`}>
      <Link href={`/tools/${tool.slug}`} className={`block ${isGrid ? 'h-full' : 'flex-1 flex'}`}>
        {/* Logo Section */}
        <div className={`${isGrid ? 'p-4 border-b border-gray-100' : 'w-32 flex-shrink-0 flex items-center justify-center bg-gray-50 p-4'}`}>
          {tool.logoUrl ? (
            <Image
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              width={isGrid ? 80 : 64}
              height={isGrid ? 80 : 64}
              className="object-contain"
            />
          ) : (
            <div className={`${
              isGrid ? 'w-20 h-20' : 'w-16 h-16'
            } bg-gray-200 rounded-lg flex items-center justify-center`}>
              <span className="text-gray-500 font-semibold text-lg">
                {tool.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`${isGrid ? 'p-4' : 'flex-1 p-4'}`}>
          {/* Header */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {category.name}
              </span>
              {tool.featured && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className={`text-gray-600 text-sm mb-3 ${isGrid ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {tool.description}
          </p>

          {/* Pricing and Difficulty */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Pricing:</span>
              <span className="font-medium text-gray-900">
                {formatPricingModel(tool.pricingModel)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Integration:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColorClass(tool.integrationDifficulty)}`}>
                {formatIntegrationDifficulty(tool.integrationDifficulty)}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{tool.viewCount} views</span>
            {showVendor && (
              <span>by Vendor</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 