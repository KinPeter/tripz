import { Session } from '@supabase/supabase-js';

export function parseHash(hash: string): Session {
  return hash
    .slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .reduce(
      (obj, [key, value]) => {
        obj[key.trim()] = ['expires_at', 'expires_in'].includes(key) ? Number(value) : value;
        return obj;
      },
      {} as Record<string, string | number>
    ) as unknown as Session;
}
