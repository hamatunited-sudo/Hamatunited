import { NextResponse } from 'next/server';
import contentData from '../../../../content.json';

export async function GET() {
  return NextResponse.json(contentData);
}
