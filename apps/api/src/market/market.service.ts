import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private cache: { data: any; ts: number } | null = null;
  private readonly CACHE_TTL = 60_000; // 1 min

  async getTopCoins(limit = 20, currency = 'usd') {
    const now = Date.now();
    if (this.cache && now - this.cache.ts < this.CACHE_TTL) {
      return this.cache.data;
    }

    try {
      const { data } = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
        timeout: 10000,
      });
      this.cache = { data, ts: now };
      return data;
    } catch (err) {
      this.logger.error('CoinGecko error', err);
      // Return cached data if available, even if stale
      if (this.cache) return this.cache.data;
      return this.getFallbackData();
    }
  }

  async getCoinDetail(id: string) {
    try {
      const { data } = await axios.get(`${COINGECKO_BASE}/coins/${id}`, {
        params: { localization: false, tickers: false, community_data: false },
        timeout: 10000,
      });
      return data;
    } catch (err) {
      this.logger.error(`CoinGecko coin detail error for ${id}`, err);
      throw err;
    }
  }

  async getCoinChart(id: string, days = 7, currency = 'usd') {
    try {
      const { data } = await axios.get(
        `${COINGECKO_BASE}/coins/${id}/market_chart`,
        { params: { vs_currency: currency, days }, timeout: 10000 },
      );
      return data;
    } catch (err) {
      this.logger.error(`CoinGecko chart error for ${id}`, err);
      throw err;
    }
  }

  private getFallbackData() {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 65000,
        price_change_percentage_24h: 2.5,
        market_cap: 1280000000000,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        sparkline_in_7d: { price: [] },
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3500,
        price_change_percentage_24h: 1.8,
        market_cap: 420000000000,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        sparkline_in_7d: { price: [] },
      },
    ];
  }
}
