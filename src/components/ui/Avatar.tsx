'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const sizeClass = sizes[size];

  if (!src) {
    return (
      <div
        className={cn(
          sizeClass,
          'rounded-full bg-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center',
          className
        )}
      >
        <User className="w-1/2 h-1/2 text-[var(--color-muted)]" />
      </div>
    );
  }

  return (
    <div className={cn(sizeClass, 'relative rounded-full overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`(max-width: 768px) ${parseInt(sizeClass.split('-')[1]) * 4}px`}
      />
    </div>
  );
}
