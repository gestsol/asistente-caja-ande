export const isNumber = (message: string): number | null => (!isNaN(Number(message)) ? Number(message) : null)
