// src/server/odooClient.ts
import axios from 'axios';
import { JsonRpcResponse, isJsonRpcError } from '~/interfaces/odoo';

const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || 'mydb';
const ODOO_UID = Number(process.env.ODOO_UID || 2); // uid ของ user/admin
const ODOO_PASSWORD = process.env.ODOO_PASSWORD || 'admin';

export async function jsonrpcCall<T>(path: string, params: any): Promise<T> {
  const payload = { jsonrpc: '2.0', method: 'call', params, id: Date.now() };

  const { data } = await axios.post<JsonRpcResponse<T>>(
    `${ODOO_URL}${path}`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (isJsonRpcError<T>(data)) {
    const errMsg =
      data.error?.data?.message ||
      data.error?.message ||
      'Odoo JSON-RPC error';
    throw new Error(errMsg);
  }

  return (data as any).result as T;
}

export async function createPartner(args: {
  name: string;
  email?: string;
  phone?: string;
}): Promise<number> {
  const { name, email, phone } = args;

  // res.partner.create(values) -> return new ID (number)
  const partnerId = await jsonrpcCall<number>('/jsonrpc', {
    service: 'object',
    method: 'execute_kw',
    args: [
      ODOO_DB,
      ODOO_UID,
      ODOO_PASSWORD,
      'res.partner',
      'create',
      [{ name, email, phone }],
    ],
  });

  return partnerId;
}
