import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '../services/portfolio.service';
import type { CreateTransactionDto } from '@crypto-app/shared-types';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getSummary,
    staleTime: 30_000,
  });
}

export function useTransactions(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['transactions', limit, offset],
    queryFn: () => portfolioService.getTransactions(limit, offset),
    staleTime: 30_000,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTransactionDto) => portfolioService.createTransaction(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['portfolio'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
