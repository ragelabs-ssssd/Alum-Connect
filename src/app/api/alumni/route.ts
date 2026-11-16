import { NextResponse } from 'next/server';
import {
  getDB2Alumni,
  authenticateDB2Alumni,
  getDB2Bounties,
  addDB2Bounty,
  getDB2DealRooms,
  addDB2DealRoom,
} from '../../../portals/alumni/db';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      db: 'DB2_ALUMNI_MARKETPLACE',
      alumni: getDB2Alumni(),
      bounties: getDB2Bounties(),
      dealRooms: getDB2DealRooms(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Failed to fetch DB 2 data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body || {};

    if (!action) {
      return NextResponse.json(
        { status: 'error', message: 'Missing action parameter' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      const { identifier, persona, shield } = payload || {};
      if (!identifier) {
        return NextResponse.json(
          { status: 'error', message: 'Missing identifier for alumni login' },
          { status: 400 }
        );
      }
      const user = authenticateDB2Alumni(identifier, persona, shield);
      return NextResponse.json({ status: 'ok', user });
    }

    if (action === 'create_bounty') {
      const { bounty } = payload || {};
      if (!bounty) {
        return NextResponse.json(
          { status: 'error', message: 'Missing bounty payload' },
          { status: 400 }
        );
      }
      const createdBounty = addDB2Bounty(bounty);
      return NextResponse.json({ status: 'ok', bounty: createdBounty });
    }

    if (action === 'create_deal_room') {
      const { deal } = payload || {};
      if (!deal) {
        return NextResponse.json(
          { status: 'error', message: 'Missing deal room payload' },
          { status: 400 }
        );
      }
      const createdDeal = addDB2DealRoom(deal);
      return NextResponse.json({ status: 'ok', deal: createdDeal });
    }

    return NextResponse.json(
      { status: 'error', message: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Server error processing DB 2 request',
      },
      { status: 500 }
    );
  }
}
