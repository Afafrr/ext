export const PAGE_DESCRIPTION_PERMISSIONS = {
  permissions: ['scripting' as const],
  origins: ['http://*/*', 'https://*/*'],
};

/** Runs inside the matching page through scripting.executeScript. */
export function readPageDescription(expectedUrl: string): string | undefined {
  if (location.href !== expectedUrl) return;
  const description = document.querySelector('meta[name="description" i]')?.getAttribute('content')?.trim()
    || document.querySelector('meta[property="og:description" i]')?.getAttribute('content')?.trim();
  return description?.slice(0, 2000) || undefined;
}
