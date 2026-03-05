import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { MarketService } from '../market/market.service';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly txService: TransactionsService,
    private readonly marketService: MarketService,
  ) {}

  async getSummary(userId: string) {
    const { data: transactions } = await this.txService.findByUser(userId, 1000);

    // Aggregate holdings by coin
    const holdings: Record<string, { amount: number; totalCost: number }> = {};

    for (const tx of transactions) {
      const symbol = tx.coinSymbol.toUpperCase();
      if (!holdings[symbol]) holdings[symbol] = { amount: 0, totalCost: 0 };

      if (tx.type === 'buy' || tx.type === 'receive') {
        holdings[symbol].amount += Number(tx.amount);
        holdings[symbol].totalCost += Number(tx.totalUsd);
      } else if (tx.type === 'sell' || tx.type === 'send') {
        holdings[symbol].amount -= Number(tx.amount);
      }
    }

    // Get current prices
    let prices: Record<string, number> = {};
    try {
      const coins = await this.marketService.getTopCoins(50);
      for (const coin of coins) {
        prices[coin.symbol.toUpperCase()] = coin.current_price;
      }
    } catch {
      prices = {};
    }

    const holdingsList = Object.entries(holdings)
      .filter(([, v]) => v.amount > 0.00000001)
      .map(([symbol, data]) => {
        const currentPrice = prices[symbol] ?? 0;
        const currentValue = data.amount * currentPrice;
        const pnl = currentValue - data.totalCost;
        const pnlPercentage = data.totalCost > 0 ? (pnl / data.totalCost) * 100 : 0;
        return {
          coinSymbol: symbol,
          amount: data.amount,
          currentPrice,
          currentValue,
          totalCost: data.totalCost,
          pnl,
          pnlPercentage,
        };
      });

    const totalValue = holdingsList.reduce((s, h) => s + h.currentValue, 0);
    const totalCost = holdingsList.reduce((s, h) => s + h.totalCost, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPercentage = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    return { totalValue, totalCost, totalPnl, totalPnlPercentage, holdings: holdingsList };
  }
}
