import { NextResponse } from 'next/server';
import {
  addDB1Product,
  addDB1Roast,
  addDB1Vouch,
  getDB1Products,
  getDB1Students,
  toggleDB1RoastResolved,
} from '../../../portals/student/db';
import {
  addDB2Bounty,
  addDB2DealRoom,
  getDB2Alumni,
  getDB2Bounties,
  getDB2DealRooms,
  incrementDB2BountyApplied,
} from '../../../portals/alumni/db';
import {
  addDB3AuditLog,
  getDB3Analytics,
  getDB3AuditLogs,
  getDB3DeanProfile,
} from '../../../portals/dean/db';
import {
  Bounty,
  CampusProduct,
  DealRoomAction,
  RoastAnnotation,
  VouchEndorsement,
} from '../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const full = searchParams.get('full') === 'true';

  const db1Students = getDB1Students();
  const db1Products = getDB1Products();
  const db2Alumni = getDB2Alumni();
  const db2Bounties = getDB2Bounties();
  const db2DealRooms = getDB2DealRooms();
  const db3Dean = getDB3DeanProfile();
  const db3Logs = getDB3AuditLogs();

  if (full) {
    return NextResponse.json({
      status: 'ok',
      service: 'ITER_BACKEND_ROUTER',
      db1Count: db1Students.length + db1Products.length,
      db2Count: db2Alumni.length + db2Bounties.length + db2DealRooms.length,
      db3Status: db3Dean ? `online (${db3Logs.length} audit logs)` : 'offline',
      students: db1Students,
      products: db1Products,
      alumni: db2Alumni,
      bounties: db2Bounties,
      dealRooms: db2DealRooms,
      dean: db3Dean,
      analytics: getDB3Analytics(),
      auditLogs: db3Logs,
    });
  }

  return NextResponse.json({
    status: 'ok',
    service: 'ITER_BACKEND_ROUTER',
    db1Count: db1Students.length + db1Products.length,
    db2Count: db2Alumni.length + db2Bounties.length + db2DealRooms.length,
    db3Status: db3Dean ? `online (${db3Logs.length} audit logs)` : 'offline',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body as { action?: string; payload?: Record<string, unknown> };

    if (!action || !payload) {
      return NextResponse.json(
        { status: 'error', message: 'Missing action or payload' },
        { status: 400 }
      );
    }

    if (action === 'ship_product') {
      const product = payload.product as CampusProduct;
      const created = addDB1Product(product);
      addDB3AuditLog({
        category: 'mvp_ship',
        title: `New Campus MVP Shipped: ${created.title}`,
        actor: created.squadMembers[0]?.name || 'ITER Student Squad',
        impact: created.tagline,
      });
      return NextResponse.json({ status: 'ok', product: created });
    }

    if (action === 'resolve_roast') {
      const updated = toggleDB1RoastResolved(
        String(payload.productId),
        String(payload.roastId)
      );
      return NextResponse.json({ status: 'ok', product: updated });
    }

    if (action === 'add_roast') {
      const updated = addDB1Roast(
        String(payload.productId),
        payload.roast as RoastAnnotation
      );
      return NextResponse.json({ status: 'ok', product: updated });
    }

    if (action === 'add_vouch') {
      const vouch = payload.vouch as VouchEndorsement;
      const updated = addDB1Vouch(String(payload.productId), vouch);
      if (updated) {
        addDB3AuditLog({
          category: 'vouch',
          title: `Verified Vouch Issued (${vouch.vouchCode}) for ${updated.title}`,
          actor: `${vouch.alumName} (${vouch.alumCompany})`,
          impact: `Certified skills: ${vouch.certifiedSkills.join(', ')}`,
        });
      }
      return NextResponse.json({ status: 'ok', product: updated });
    }

    if (action === 'create_bounty') {
      const bounty = addDB2Bounty(payload.bounty as Bounty);
      return NextResponse.json({ status: 'ok', bounty });
    }

    if (action === 'apply_bounty') {
      const bounty = incrementDB2BountyApplied(String(payload.bountyId));
      return NextResponse.json({ status: 'ok', bounty });
    }

    if (action === 'submit_deal_room') {
      const deal = addDB2DealRoom(payload.deal as DealRoomAction);
      addDB3AuditLog({
        category: 'deal_room',
        title: `Deal Room Opened: ${deal.productTitle}`,
        actor: `${deal.senderName} (${deal.senderCompany})`,
        impact: `${deal.actionType.replace('_', ' ')} • ${deal.proposedCompensation || 'Fast-track review'}`,
      });
      return NextResponse.json({ status: 'ok', deal });
    }

    return NextResponse.json(
      { status: 'error', message: `Unsupported gateway action: ${action}` },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid JSON request body' },
      { status: 400 }
    );
  }
}
