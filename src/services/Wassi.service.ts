import {HttpClient} from '~CLASS/HttpClient'
import {getConfig} from '~UTILS/config.util'
import {botDebug} from '~UTILS/debug.util'
import FormData  from 'form-data'
import axios  from 'axios'
export class WassiService extends HttpClient {
    private device: string

    constructor() {
        const {apiUrl, token, device} = getConfig().wassi
        super({
            baseURL: apiUrl,
            defaultPath: '/v1',
            headers: {token}
        })
        this.device = device
    }

    public async sendMessage<R = TWassiResponse['messages']['message']>({
                                                                            phone,
                                                                            message,
                                                                            priority = 'normal'
                                                                        }: TWassiMessage): Promise<R | null> {
        const body_r: TWassiBody['messages'] = {phone, message, priority, device: this.device}
        try {
            const {data} = await this.http.post<R>('/messages', body_r)
            // console.log(JSON.stringify(data))
            let {body, status} = data['messages']['message']['data']
            message = body ? body.split('\n')[0] + '...' : body

            botDebug('WASSI-OUT', `(Message in ${status}) ${message}`)
            return data['messages']['message']['data']
        } catch (_) {
            // TODO: crear un mensaje para retornar en caso de error
            console.log(_)
            return null
        }
    }

    public async uploadFile<R = TWassiResponse['files']>(
        {
            phone,
            filename,
            expiration = '10m',
            permission = 'public'
        }: TWassiBody['files'],
        stream: TDataStream
    ): Promise<R | []> {
        try {
            const params = {
                phone,
                filename,
                expiration,
                format: 'native',
                permission
            };
            const form = new FormData();
            form.append('file', stream, { filename: filename });
            await axios.post(`https://whatspro.ntic.cl/v1/files/${phone}`, form, {
                headers: form.getHeaders(),
            })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
            return []
        } catch (_) {
            console.log(_)
            return []
        }
    }

    public async sendFile<R = TWassiResponse['messages']['media']>({
                                                                       phone,
                                                                       message,
                                                                       priority = 'normal',
                                                                       media
                                                                   }: TWassiMessage) {
        const body: TWassiBody['messages'] = {phone, message, priority, media, device: this.device}

        try {
            const {data} = await this.http.post<R>('/messages', body)

            const {
                media: {file},
                status
            } = (data as unknown) as TWassiResponse['messages']['media']

            botDebug('WASSI-OUT', `(File in ${status}) ${file}`)

            return data
        } catch (_) {
            console.log(_)
            return null
        }
    }

    public async downloadFile<R = TDataStream>(fileId: string): Promise<R | null> {
        try {
            const {data} = await this.http.get<R>(`/io/${this.device}/files/${fileId}/download`, {
                responseType: 'stream'
            })

            return data
        } catch (_) {
            console.log(_)
            return null
        }
    }
}
