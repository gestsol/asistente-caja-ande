import { NextFunction, Request } from 'express'

export function parseMedia(req: Request, _, next: NextFunction): void {
  const { media } = req.body.data as TWassiRequest['data']

  const file: TDataController['file'] = media
    ? {
        id: media.id,
        size: media.size,
        mime: media.mime,
        extension: media.extension,
        filename: media.filename ? media.filename.split('.')[0] : media.id
      }
    : null

  req.app.set('file', file)

  next()
}
