export interface IDailySummary {
  id: number;
  date: Date;
  transactions: number;
  revenue: number;
  costOfGoods: number;
  grossProfit: number;
  margin: number;
  fees: number;
  tips: number;
  tipsAmount: number;
  refunds: number;
  refundsAmount: number;
  taxAmount: number;
  netRevenue: number;
}

export class DailySummary implements IDailySummary {
  constructor(
    public readonly id: number = 0,
    public readonly date: Date = new Date(),
    public readonly transactions: number = 0,
    public readonly revenue: number = 0,
    public readonly costOfGoods: number = 0,
    public readonly grossProfit: number = 0,
    public readonly margin: number = 0,
    public readonly fees: number = 0,
    public readonly tips: number = 0,
    public readonly tipsAmount: number = 0,
    public readonly refunds: number = 0,
    public readonly refundsAmount: number = 0,
    public readonly taxAmount: number = 0,
    public readonly netRevenue: number = 0
  ) {}

  static fromJSON(json: IDailySummary) {
    return new DailySummary(
      json.id,
      json.date,
      json.transactions,
      json.revenue,
      json.costOfGoods,
      json.grossProfit,
      json.margin,
      json.fees,
      json.tips,
      json.tipsAmount,
      json.refunds,
      json.refundsAmount,
      json.taxAmount,
      json.netRevenue
    );
  }
}
