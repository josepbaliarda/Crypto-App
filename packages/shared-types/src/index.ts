// Auth DTOs
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

// User types
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  is2faEnabled: boolean;
  createdAt: string;
}

// Wallet types
export interface WalletDto {
  id: string;
  address: string;
  network: string;
  createdAt: string;
}

export interface CreateWalletDto {
  network?: string;
}

// Transaction types
export type TransactionType = 'buy' | 'sell' | 'send' | 'receive';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface TransactionDto {
  id: string;
  type: TransactionType;
  coinSymbol: string;
  amount: number;
  priceUsd: number;
  totalUsd: number;
  txHash?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  coinSymbol: string;
  amount: number;
  priceUsd: number;
}

// Market types
export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChangePercentage24h: number;
  marketCap: number;
  image: string;
  sparkline?: number[];
}

// Portfolio types
export interface PortfolioHolding {
  coinSymbol: string;
  coinName: string;
  amount: number;
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  pnl: number;
  pnlPercentage: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercentage: number;
  holdings: PortfolioHolding[];
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
