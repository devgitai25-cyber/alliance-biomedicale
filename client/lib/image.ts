/**
 * Resolves image URLs for display.
 * - Cloudinary/external URLs (http/https) are returned as-is
 * - Data URLs (base64) are returned as-is
 * - Local upload paths (/uploads/...) are prefixed with the API base URL
 * - Fallback returns a placeholder
 */
export function resolveImageUrl(src: string | undefined): string {
    if (!src) return '/placeholder.png';

    // Already a full URL (Cloudinary, etc.)
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }

    // Base64 data URL — pass through
    if (src.startsWith('data:')) {
        return src;
    }

    // Local upload path — prefix with API server URL
    if (src.startsWith('/uploads/')) {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        // Remove /api suffix to get the server base URL
        const serverBase = apiBase.replace(/\/api\/?$/, '');
        return `${serverBase}${src}`;
    }

    return src;
}

/**
 * Check if an image URL is external (should use unoptimized)
 */
export function isExternalImage(src: string | undefined): boolean {
    if (!src) return false;
    return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Check if the image should skip Next.js optimization.
 * Base64 data URLs can't go through the Next.js image optimizer.
 */
export function shouldSkipOptimization(src: string | undefined): boolean {
    if (!src) return false;
    return src.startsWith('data:');
}
