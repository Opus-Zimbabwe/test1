import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { contactSubmissions } from '@/lib/db/schema'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  service: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(4000),
  consent: z.coerce.boolean().refine(Boolean),
}).strict()

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 })
    }

    await db.insert(contactSubmissions).values({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      service: result.data.service,
      message: result.data.message,
      consent: result.data.consent,
    })

    return NextResponse.json({ ok: true, message: 'Your enquiry has been received.' }, { status: 202 })
  } catch {
    return NextResponse.json({ error: 'We could not process your enquiry.' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST' } })
}
