import { api } from './api';
import type { PortfolioSummary, TransactionDto, CreateTransactionDto } from '@crypto-app/shared-types';

export const portfolioService = {
  async getSummary(): Promise<PortfolioSummary> {
    const { data } = await api.get('/portfolio');
    return data;
  },

  async getTransactions(limit = 50, offset = 0): Promise<{ data: TransactionDto[]; total: number }> {
    const { data } = await api.get(`/transactions?limit=${limit}&offset=${offset}`);
    return data;
  },

  async createTransaction(dto: CreateTransactionDto): Promise<TransactionDto> {
    const { data } = await api.post('/transactions', dto);
    return data;
  },
};
