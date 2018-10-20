export const MQ_HOST = 'localhost'
export const MQ_PORT = 5672
export const INPUT = 'INPUT'
export const OUTPUT = 'OUTPUT'

type Job = (row: string) => any

export const toUpperCase: Job = (row: string) => {
  return row.toUpperCase()
}
