import { corsHeaders } from './cors.ts';

export class OkResponse extends Response {
  constructor(data: unknown) {
    super(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export class CorsOkResponse extends Response {
  constructor() {
    super('ok', { headers: corsHeaders });
  }
}

export class ErrorResponse extends Response {
  constructor(message: string, status: number) {
    super(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    });
  }
}
