// src/pages/api/odoo/create-partner.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPartner } from '~/server/odooClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
    }

    const { email, name, phone } = req.body || {};

    if (!email) {
      return res.status(400).json({ ok: false, error: 'EMAIL_REQUIRED' });
    }

    const derivedName =
      name && String(name).trim().length > 0
        ? String(name).trim()
        : String(email).split('@')[0];

    const id = await createPartner({ name: derivedName, email, phone });

    return res.status(200).json({ ok: true, id });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err?.message || 'ODDO_PARTNER_CREATE_FAILED',
    });
  }
}
