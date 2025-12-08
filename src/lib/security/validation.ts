import { z } from 'zod';

// Checkout validation
export const checkoutSchema = z.object({
  priceId: z.string()
    .min(1, 'Price ID is required')
    .regex(/^price_/, 'Invalid price ID format'),
});

// Lesson completion validation
export const lessonCompletionSchema = z.object({
  lessonId: z.string().min(1).max(100),
  hintsUsed: z.number().int().min(0).max(100),
  timeSpent: z.number().int().min(0).max(86400), // Max 24 hours
});

// User profile update validation
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
});

// Generic ID validation
export const uuidSchema = z.string().uuid();

// Email validation
export const emailSchema = z.string().email().max(255);

// Sanitize string input (remove potential XSS)
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}

// Validate and parse with error handling
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errorMessage = result.error.errors
    .map(e => `${e.path.join('.')}: ${e.message}`)
    .join(', ');

  return { success: false, error: errorMessage };
}
