import { NextResponse } from 'next/server';
import {
  addDB1Product,
  authenticateDB1Student,
  getDB1Products,
  getDB1Students,
  toggleDB1RoastResolved,
} from '../../../portals/student/db';
import { CampusProduct, StudentCohort } from '../../../types';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    db: 'DB1_STUDENTS',
    students: getDB1Students(),
    products: getDB1Products(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body as { action?: string };

    if (action === 'login') {
      const identifier = String(body.identifier ?? body.email ?? '');
      const cohort = body.cohort as StudentCohort | undefined;
      const user = authenticateDB1Student(identifier, cohort);

      return NextResponse.json({
        status: 'ok',
        db: 'DB1_STUDENTS',
        user,
      });
    }

    if (action === 'ship_product') {
      const incoming = (body.product ?? body) as Partial<CampusProduct>;
      const newProduct: CampusProduct = {
        id: incoming.id || `prod_${Date.now()}`,
        title: incoming.title || 'Untitled Project',
        tagline: incoming.tagline || 'Student build from SOA ITER',
        description:
          incoming.description ||
          incoming.problemStatement ||
          'Shipped on ITER Alum Connect Student Builder Studio',
        category: incoming.category || 'web_app',
        status: incoming.status || 'beta',
        userTraction: incoming.userTraction ?? 10,
        tractionLabel:
          incoming.tractionLabel ||
          `${incoming.userTraction ?? 10}+ Campus Beta Testers`,
        githubUrl: incoming.githubUrl || 'https://github.com/iter-builders',
        commitsCount: incoming.commitsCount ?? 12,
        recentCommits: incoming.recentCommits || [
          {
            hash: 'a1b2c3d',
            message: 'feat: initial production launch on SOA Alum Connect',
            author: body.authorName || 'ITER Builder',
            timeAgo: 'Just now',
          },
        ],
        liveDemoUrl: incoming.liveDemoUrl || 'https://demo.soa.ac.in',
        previewImage:
          incoming.previewImage ||
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        squadMembers: incoming.squadMembers || [],
        vouches: incoming.vouches || [],
        roasts: incoming.roasts || [],
        tags: incoming.tags || ['Next.js', 'React', 'Tailwind CSS'],
        problemStatement: incoming.problemStatement,
        rolesNeeded: incoming.rolesNeeded,
        hiringStatus: incoming.hiringStatus || 'Open for Internships',
        publishedAt: incoming.publishedAt || 'Just now',
        viewsCount: incoming.viewsCount ?? 42,
      };

      const created = addDB1Product(newProduct);

      return NextResponse.json({
        status: 'ok',
        db: 'DB1_STUDENTS',
        product: created,
      });
    }

    if (action === 'resolve_roast') {
      const productId = String(body.productId ?? '');
      const roastId = String(body.roastId ?? '');

      if (!productId || !roastId) {
        return NextResponse.json(
          { status: 'error', message: 'productId and roastId are required' },
          { status: 400 }
        );
      }

      const updated = toggleDB1RoastResolved(productId, roastId);
      if (!updated) {
        return NextResponse.json(
          { status: 'error', message: 'Product or roast not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        status: 'ok',
        db: 'DB1_STUDENTS',
        product: updated,
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Unsupported action for DB1_STUDENTS' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid JSON request body' },
      { status: 400 }
    );
  }
}
