import { Session } from '@supabase/supabase-js';

type ParsedHash = {
  success: boolean;
  payload: Session | Record<string, string | number>;
};

export function parseHash(hash: string): ParsedHash {
  const hasAsObject = hash
    .slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .reduce(
      (obj, [key, value]) => {
        obj[key.trim()] = ['expires_at', 'expires_in'].includes(key) ? Number(value) : value;
        return obj;
      },
      {} as Record<string, string | number>
    );

  return {
    success: !Object.keys(hasAsObject).some(key => key.startsWith('error')),
    payload: hasAsObject,
  };
}
