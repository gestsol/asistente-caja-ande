type TWassiBody = {
  id: string
  object: string
  event: string
  created: number
  device: {
    id: string
    phone: string
    alias: string
    plan: string
    version: number
  }
  data: {
    id: string
    type: string
    flow: string
    status: string
    ack: string
    from: string
    fromNumber: string
    to: string
    toNumber: string
    date: string
    timestamp: number
    body: string
    chat: {
      id: string
      name: string
      date: string
      type: string
      status: string
      statusUpdatedAt: string
      firstMessageAt: string
      lastMessageAt: string
      lastOutboundMessageAt: string
      lastInboundMessageAt: string
      stats: object
      labels: Array<any>
      owner: object
      contact: object
    }
    events: object
    meta: {
      rtl: boolean
      containsEmoji: boolean
      isGif: boolean
      isStar: boolean
      isGroup: boolean
      isForwarded: boolean
      isEphemeral: boolean
      isNotification: boolean
      isLive: boolean
      isBroadcast: boolean
      isBizNotification: boolean
      isDoc: boolean
      isLinkPreview: boolean
      isPSA: boolean
      isRevoked: boolean
      isUnreadType: boolean
      isFailed: boolean
      notifyName: string
    }
  }
}

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
