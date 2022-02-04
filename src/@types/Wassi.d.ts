type TWassiResponse = {
  id: string
  waId: string
  phone: string
  wid: string
  status: string
  deliveryStatus: string
  createdAt: string
  deliverAt: string
  message: string
  priority: string
  retentionPolicy: string
  retry: { count: number }
  webhookStatus: string
  device: string
}
