import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const world = request.nextUrl.searchParams.get('world');
  if (!world) return NextResponse.json({ content: null });

  const docsDir = path.join(process.cwd(), 'docs');
  const manifestPath = path.join(docsDir, 'manifest.json');

  if (!fs.existsSync(manifestPath)) return NextResponse.json({ content: null });

  let manifest: Record<string, string> = {};
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  } catch {
    return NextResponse.json({ content: null });
  }

  const slug = manifest[world];
  if (!slug) return NextResponse.json({ content: null });

  const filePath = path.join(docsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return NextResponse.json({ content: null });

  const content = fs.readFileSync(filePath, 'utf-8');
  return NextResponse.json({ content });
}
