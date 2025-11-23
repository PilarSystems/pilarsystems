/**
 * Health Check API Route
 * 
 * This route provides a health check endpoint that delegates to the
 * Fastify backend server using server.inject().
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServer } from '@/src/server/app';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health
 */
export async function GET(request: NextRequest) {
  try {
    const server = await getServer();

    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });

    const data = JSON.parse(response.body);

    return NextResponse.json(data, {
      status: response.statusCode,
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        ok: false,
        timestamp: Date.now(),
        service: 'pilar-backend',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
