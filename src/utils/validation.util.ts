export const isNumber = (message: string): number | null => (!isNaN(Number(message)) ? Number(message) : null)

export const isEmail = (message: string): boolean => new RegExp(/^[a-z0-9_.]+\@[a-z]+\.[a-z]+$/).test(message)
