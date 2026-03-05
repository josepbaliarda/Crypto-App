import { api } from './api';
import type { CoinPrice } from '@crypto-app/shared-types';

export const marketService = {
  async getTopCoins(limit = 20): Promise<CoinPrice[]> {
    const { data } = await api.get(`/market/coins?limit=${limit}`);
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      currentPrice: coin.current_price,
      priceChangePercentage24h: coin.price_change_percentage_24h ?? 0,
      marketCap: coin.market_cap,
      image: coin.image,
      sparkline: coin.sparkline_in_7d?.price ?? [],
    }));
  },

  async getCoinDetail(id: string) {
    const { data } = await api.get(`/market/coins/${id}`);
    return data;
  },

  async getCoinChart(id: string, days = 7) {
    const { data } = await api.get(`/market/coins/${id}/chart?days=${days}`);
    return data;
  },
};
