export class Batch {
  public rows: any
  public size: number

  constructor(batchSize = 10) {
    this.size = batchSize
    this.rows = []
  }

  public push(row: Buffer): void {
    if (!this.full()) {
      this.rows.push(row)
    }
  }

  public full(): boolean {
    return this.rows.length === this.size
  }

  public clear(): void {
    this.rows = []
  }
}
