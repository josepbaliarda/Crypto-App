import { api } from './api';
import type { WalletDto } from '@crypto-app/shared-types';

export const walletService = {
  async getWallets(): Promise<WalletDto[]> {
    const { data } = await api.get('/wallets');
    return data;
  },

  async getPrimaryWallet(): Promise<WalletDto> {
    const { data } = await api.get('/wallets/primary');
    return data;
  },

  async createWallet(network = 'sepolia'): Promise<WalletDto> {
    const { data } = await api.post('/wallets', { network });
    return data;
  },

  async getBalance(walletId: string) {
    const { data } = await api.get(`/wallets/${walletId}/balance`);
    return data;
  },
};
