'use client';
import React from 'react';
import { EditorialScrollStack } from './EditorialScrollStack';
import { PortfolioItem } from '../types';

export const COSMOS_BRIDAL_IMAGES = [
  'https://images.beta.cosmos.so/e5ebb6f8-8202-40ec-bc70-976f81153501?format=jpeg',
  'https://images.beta.cosmos.so/1b6f1bee-1b4c-4035-9e93-c93ef4d445e1?format=jpeg',
  'https://images.beta.cosmos.so/9968a6cf-d7f6-4ec9-a56d-ac4eef3f8689?format=jpeg',
  'https://images.beta.cosmos.so/4b88a39c-c657-4911-b843-b473237e83b5?format=jpeg',
  'https://images.beta.cosmos.so/86af92c0-064d-4801-b7ed-232535b03328?format=jpeg',
  'https://images.beta.cosmos.so/399e2a4a-e118-4aaf-9c7e-155ed18f6556?format=jpeg',
  'https://images.beta.cosmos.so/6ff16bc9-dc94-4549-a057-673a603ce203?format=jpeg',
  'https://images.beta.cosmos.so/d67c3185-4480-4408-8f9d-1cbf541e5d91?format=jpeg',
  'https://images.beta.cosmos.so/a7b19274-3370-4080-b734-e8ac268d8c8e.?format=jpeg',
  'https://images.beta.cosmos.so/551daf0d-77e8-472c-9324-468fed15a0ba?format=jpeg',
];

export interface InViewImagesGridProps {
  onOpenLightbox?: (item: PortfolioItem) => void;
  className?: string;
}

/**
 * InViewImagesGrid (Legacy wrapper)
 * Replaced by the continuous scroll-driven Left-to-Right EditorialScrollStack.
 */
export const InViewImagesGrid: React.FC<InViewImagesGridProps> = ({
  onOpenLightbox,
  className = ''
}) => {
  return <EditorialScrollStack onOpenLightbox={onOpenLightbox} className={className} />;
};

export default InViewImagesGrid;
