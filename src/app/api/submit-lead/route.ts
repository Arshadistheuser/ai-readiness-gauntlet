import { NextResponse } from 'next/server';

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || '7991245';

interface LeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  industry: string;
  companySize: string;
  role: string;
  aiReadinessScore: number;
  maturityTier: string;
  topGap: string;
  topStrength: string;
}

export async function POST(request: Request) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.email || !body.firstName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!HUBSPOT_API_KEY) {
      console.log('HubSpot API key not configured. Lead data:', {
        email: body.email,
        company: body.company,
        score: body.aiReadinessScore,
        tier: body.maturityTier,
      });
      return NextResponse.json({ success: true, message: 'Lead captured (dev mode)' });
    }

    const properties = {
      firstname: body.firstName,
      lastname: body.lastName,
      email: body.email,
      company: body.company,
      jobtitle: body.role,
      industry: body.industry,
      numberofemployees: body.companySize === 'enterprise' ? '5000' : body.companySize === 'mid-market' ? '500' : '100',
      ai_readiness_score: String(body.aiReadinessScore),
      ai_maturity_tier: body.maturityTier,
      ai_top_gap: body.topGap,
      ai_top_strength: body.topStrength,
      lead_source: 'AI Readiness Gauntlet',
      hs_lead_status: 'NEW',
    };

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      },
      body: JSON.stringify({ properties }),
    });

    if (response.status === 409) {
      const errorData = await response.json();
      const existingId = errorData?.message?.match(/Existing ID: (\d+)/)?.[1];

      if (existingId) {
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          },
          body: JSON.stringify({ properties }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
