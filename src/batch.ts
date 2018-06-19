export class Batch {
  public rows: any
  public size: number

  constructor(batchSize = 10) {
    this.size = batchSize
    this.rows = []
  }

  public push(row: Buffer, encoding?: string): void {

    if (!this.full()) {
      const data = (encoding !== 'buffer' && encoding !== 'undefined') ? row.toString(encoding) : row
      this.rows.push(data)
    }
  }

  public full(): boolean {
    return this.rows.length === this.size
  }

  public clear(): void {
    this.rows = []
  }
}
