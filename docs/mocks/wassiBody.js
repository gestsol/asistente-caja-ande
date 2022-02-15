// Body que llega desde el servicio de Wassi

const wassiBody = {
  id: '3EB0F58B54F91F569BCB',
  object: 'message',
  event: 'message:in:new',
  created: 1644934150,
  device: {
    id: '61e5bb67625a563809c2fca8',
    phone: '56974586807',
    alias: 'Caja Ande',
    plan: 'io-business',
    version: 1
  },
  data: {
    id: '3EB0F58B54F91F569BCB',
    type: 'text',
    flow: 'inbound',
    status: 'active',
    ack: 'delivered',
    from: '584245309444@c.us',
    fromNumber: '+584245309444',
    to: '56974586807@c.us',
    toNumber: '+56974586807',
    date: '2022-02-15T14:09:09.000Z',
    timestamp: 1644934149,
    body: 'hola',
    chat: {
      id: '584245309444@c.us',
      name: 'Edixon �',
      date: '2022-02-15T13:43:56.000Z',
      type: 'chat',
      status: 'active',
      statusUpdatedAt: '2022-02-04T15:58:04.298Z',
      firstMessageAt: '2022-02-04T00:47:36.000Z',
      lastMessageAt: '2022-02-15T14:09:09.000Z',
      lastOutboundMessageAt: '2022-02-15T13:43:56.000Z',
      lastInboundMessageAt: '2022-02-15T14:09:09.000Z',
      stats: [Object],
      labels: [],
      owner: [Object],
      contact: [Object]
    },
    events: {},
    meta: {
      rtl: false,
      containsEmoji: false,
      isGif: false,
      isStar: false,
      isGroup: false,
      isForwarded: false,
      isEphemeral: false,
      isNotification: false,
      isLive: false,
      isBroadcast: false,
      isBizNotification: false,
      isDoc: false,
      isLinkPreview: false,
      isPSA: false,
      isRevoked: false,
      isUnreadType: false,
      isFailed: false,
      notifyName: ''
    }
  }
}
