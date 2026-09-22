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
  productCode: string;
  orderId: string;
  statusHistory: Array<{ status: DeliveryStatus; createdAt: string | null }>;
  createdAt: string | null;
  updatedAt: string | null;
};

export type RiderNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

function client() {
  if (!supabase) throw new Error('SwiftPex Supabase is not configured.');
  return supabase;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function text(row: Record<string, unknown>, ...keys: string[]) {
  const value = keys.map((key) => row[key]).find((item) => item !== null && item !== undefined);
  return value == null ? '' : String(value);
}

function mapJob(input: unknown): DeliveryJob {
  const row = record(input);
  const order = record(row.orders);
  const history = Array.isArray(row.delivery_status_history) ? row.delivery_status_history : [];
  return {
    id: text(row, 'id', 'job_id'),
    reference: text(row, 'reference', 'job_number', 'order_number', 'tracking_number') ||
      text(order, 'order_number', 'tracking_number') || 'Delivery job',
    status: text(row, 'status', 'job_status').toUpperCase() as DeliveryStatus,
    pickupAddress: text(row, 'pickup_address', 'pickup_location', 'origin_address', 'pickup') ||
      text(order, 'pickup_address', 'origin_address'),
    destinationAddress: text(row, 'delivery_address', 'dropoff_address', 'destination') ||
      text(order, 'delivery_address', 'destination_address'),
    recipientName: text(row, 'recipient_name', 'customer_name', 'consignee_name') ||
      text(order, 'recipient_name', 'customer_name'),
    recipientPhone: text(row, 'recipient_phone', 'customer_phone', 'consignee_phone') ||
      text(order, 'recipient_phone', 'customer_phone'),
    notes: text(row, 'notes', 'delivery_notes', 'special_instructions') ||
      text(order, 'notes', 'delivery_notes'),
    productCode: text(row, 'product_code', 'productCode', 'sku') ||
      text(order, 'product_code', 'productCode', 'sku'),
    orderId: text(row, 'order_id') || text(order, 'id'),
    statusHistory: history.map((item) => {
      const event = record(item);
      return {
        status: text(event, 'status', 'delivery_status').toUpperCase() as DeliveryStatus,
        createdAt: text(event, 'created_at') || null,
      };
    }),
    createdAt: text(row, 'created_at') || null,
    updatedAt: text(row, 'updated_at') || null,
  };
}

async function rpc<T>(name: string, args: Record<string, unknown>) {
  const result = await client().rpc(name, args);
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export async function listJobs(): Promise<DeliveryJob[]> {
  const { data, error } = await client()
    .from('delivery_jobs')
    .select('*, orders(*), delivery_status_history(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapJob).filter((job) => job.id);
}

export async function getJob(id: string): Promise<DeliveryJob> {
  const { data, error } = await client()
    .from('delivery_jobs')
    .select('*, orders(*), delivery_status_history(*)')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return mapJob(data);
}

export async function acceptJob(id: string) {
  return rpc<unknown>('accept_delivery_job', { p_job_id: id });
}

export async function updateJobStatus(id: string, status: DeliveryStatus) {
  return rpc<unknown>('update_delivery_job_status', { p_job_id: id, p_status: status });
}

export async function getNotifications(): Promise<RiderNotification[]> {
  throw new Error('Notifications are not available in the verified live rider schema.');
}

export async function markNotificationRead(_id: string) {
  throw new Error('Notifications are not available in the verified live rider schema.');
}