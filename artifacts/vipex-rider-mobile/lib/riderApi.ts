import { supabase } from '@/lib/supabase';

export const DELIVERY_STATUSES = [
  'NEW', 'ASSIGNED', 'ACCEPTED', 'AT_PICKUP', 'PICKED_UP',
  'IN_TRANSIT', 'AT_DESTINATION', 'DELIVERED',
] as const;
export const EXCEPTION_STATUSES = ['FAILED', 'CANCELLED', 'RETURNING', 'RETURNED'] as const;
export type DeliveryStatus = typeof DELIVERY_STATUSES[number] | typeof EXCEPTION_STATUSES[number];

export type DeliveryJob = {
  id: string;
  reference: string;
  status: DeliveryStatus;
  pickupAddress: string;
  destinationAddress: string;
  recipientName: string;
  recipientPhone: string;
  notes: string;
  riderFee: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type Earnings = { available: number; pending: number; paid: number; total: number; deliveries: number; currency: string };
export type Withdrawal = { id: string; amount: number; status: string; createdAt: string; provider: string };
export type RiderNotification = { id: string; title: string; body: string; read: boolean; createdAt: string };

function requireClient() {
  if (!supabase) throw new Error('SwiftPex Supabase is not configured.');
  return supabase;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}
function text(row: Record<string, unknown>, ...keys: string[]) {
  const value = keys.map((key) => row[key]).find((item) => item !== null && item !== undefined);
  return value == null ? '' : String(value);
}
function money(row: Record<string, unknown>, ...keys: string[]) {
  const value = keys.map((key) => row[key]).find((item) => item !== null && item !== undefined);
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
function mapJob(input: unknown): DeliveryJob {
  const row = asRecord(input);
  return {
    id: text(row, 'id', 'job_id'),
    reference: text(row, 'reference', 'job_number', 'order_number', 'tracking_number') || 'Delivery job',
    status: text(row, 'status', 'job_status').toUpperCase() as DeliveryStatus,
    pickupAddress: text(row, 'pickup_address', 'pickup_location', 'origin_address', 'pickup'),
    destinationAddress: text(row, 'delivery_address', 'destination_address', 'dropoff_address', 'destination'),
    recipientName: text(row, 'recipient_name', 'customer_name', 'consignee_name'),
    recipientPhone: text(row, 'recipient_phone', 'customer_phone', 'consignee_phone'),
    notes: text(row, 'notes', 'delivery_notes', 'special_instructions'),
    riderFee: money(row, 'rider_fee', 'rider_earnings', 'delivery_fee'),
    createdAt: text(row, 'created_at') || null,
    updatedAt: text(row, 'updated_at') || null,
  };
}
async function rpc<T>(name: string, args: Record<string, unknown> = {}) {
  const client = requireClient();
  const result = await client.rpc(name, args);
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}
function rows(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  for (const key of ['jobs', 'data', 'items', 'notifications', 'withdrawals']) if (Array.isArray(record[key])) return record[key] as unknown[];
  return data ? [data] : [];
}

export async function listJobs(): Promise<DeliveryJob[]> {
  try {
    return rows(await rpc('rider_get_jobs')).map(mapJob).filter((job) => job.id);
  } catch (rpcError) {
    const { data, error } = await requireClient().from('delivery_jobs').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(rpcError instanceof Error ? `${rpcError.message} (${error.message})` : error.message);
    return (data ?? []).map(mapJob).filter((job) => job.id);
  }
}
export async function getJob(id: string) {
  try {
    return mapJob(await rpc('rider_get_job', { p_job_id: id }));
  } catch {
    const { data, error } = await requireClient().from('delivery_jobs').select('*').eq('id', id).single();
    if (error) throw new Error(error.message);
    return mapJob(data);
  }
}
export async function acceptJob(id: string) { return rpc('rider_accept_job', { p_job_id: id }); }
export async function updateJobStatus(id: string, status: DeliveryStatus, proofUrl?: string) {
  return rpc('rider_update_delivery_status', { p_job_id: id, p_status: status, p_proof_url: proofUrl ?? null });
}
export async function confirmPickup(id: string) { return updateJobStatus(id, 'PICKED_UP'); }
export async function confirmDelivery(id: string, proofUrl?: string) { return updateJobStatus(id, 'DELIVERED', proofUrl); }
export async function setOnline(isOnline: boolean) { return rpc('rider_set_online', { p_is_online: isOnline }); }
export async function getEarnings(): Promise<Earnings> {
  const data = asRecord(await rpc('rider_get_earnings'));
  return {
    available: Number(data.available ?? data.available_balance ?? 0),
    pending: Number(data.pending ?? data.pending_balance ?? 0),
    paid: Number(data.paid ?? data.paid_total ?? 0),
    total: Number(data.total ?? data.total_earnings ?? 0),
    deliveries: Number(data.deliveries ?? data.completed_deliveries ?? 0),
    currency: text(data, 'currency') || 'GHS',
  };
}
export async function requestWithdrawal(amount: number, provider: string, account: string) {
  return rpc('rider_request_withdrawal', { p_amount: amount, p_provider: provider, p_account: account });
}
export async function getWithdrawals(): Promise<Withdrawal[]> {
  return rows(await rpc('rider_get_withdrawals')).map((value) => {
    const row = asRecord(value);
    return { id: text(row, 'id'), amount: Number(row.amount ?? 0), status: text(row, 'status'), createdAt: text(row, 'created_at'), provider: text(row, 'provider') };
  });
}
export async function getNotifications(): Promise<RiderNotification[]> {
  return rows(await rpc('rider_get_notifications')).map((value) => {
    const row = asRecord(value);
    return { id: text(row, 'id'), title: text(row, 'title'), body: text(row, 'body', 'message'), read: Boolean(row.read ?? row.is_read), createdAt: text(row, 'created_at') };
  });
}
export async function markNotificationRead(id: string) { return rpc('rider_mark_notification_read', { p_notification_id: id }); }