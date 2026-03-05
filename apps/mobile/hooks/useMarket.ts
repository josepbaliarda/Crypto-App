import { useQuery } from '@tanstack/react-query';
import { marketService } from '../services/market.service';

export function useTopCoins(limit = 20) {
  return useQuery({
    queryKey: ['market', 'coins', limit],
    queryFn: () => marketService.getTopCoins(limit),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ['market', 'coin', id],
    queryFn: () => marketService.getCoinDetail(id),
    staleTime: 30_000,
    enabled: !!id,
  });
}

export function useCoinChart(id: string, days = 7) {
  return useQuery({
    queryKey: ['market', 'chart', id, days],
    queryFn: () => marketService.getCoinChart(id, days),
    staleTime: 60_000,
    enabled: !!id,
  });
}
