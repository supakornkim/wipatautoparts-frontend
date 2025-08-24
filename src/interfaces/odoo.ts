// src/interfaces/odoo.ts

export type JsonRpcId = number | string | null;

export interface JsonRpcSuccess<T> {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result: T;
}

export interface JsonRpcErrorPayload {
  code: number;
  message: string;
  data?: {
    name?: string;
    debug?: string;
    message?: string;
    arguments?: any[];
    context?: any;
    [k: string]: any;
  };
}

export interface JsonRpcError {
  jsonrpc: '2.0';
  id: JsonRpcId;
  error: JsonRpcErrorPayload;
}

export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

export function isJsonRpcError<T>(r: JsonRpcResponse<T>): r is JsonRpcError {
  return (r as any)?.error != null;
}
