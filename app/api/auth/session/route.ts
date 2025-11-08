import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '../../../../lib/auth';
import { db } from '../../../../lib/db';

export async function GET() {
  const session = await getSessionFromRequest();
  if (!session?.userId) return NextResponse.json({ user: null }, { status: 200 });

  const user = await db.user.findUnique({ where: { id: session.userId }, include: { profile: true } });
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, profile: user.profile } }, { status: 200 });
}
