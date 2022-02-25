type TWassiBody = {
  messages: {
    phone: string
    message?: string
    media?: {
      file: string
      format?: string | 'native'
      message?: string
    }
    device?: string
  }
  files: {
    filename: string
    expiration?:
      | '10m'
      | '30m'
      | '1h'
      | '6h'
      | '12h'
      | '1d'
      | '2d'
      | '3d'
      | '5d'
      | '7d'
      | '15d'
      | '30d'
      | '60d'
      | '90d'
      | '120d'
      | '180d'
      | '360d'
    permission?: 'public' | 'private'
  }
}

type TWassiResponse = {
  messages: {
    message: {
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
    media: {
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
      retry: {
        count: number
      }
      webhookStatus: string
      media: {
        format: string
        file: string
        message: string
      }
      device: string
    }
  }
  files: Array<{
    id: string
    format: string | 'native'
    filename: string
    size: number
    origin: string
    mime: string
    ext: string
    kind: string
    sha2: string
    tags: any[]
    status: string
    mode: string
    user: string
    permission: string
    createdAt: string
    expiresAt: string
    stats: {
      downloads: number
      deliveries: number
    }
  }>
}

type TWassiRequest = {
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
