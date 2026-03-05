import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity, TransactionType } from './entities/transaction.entity';

export interface CreateTransactionData {
  type: TransactionType;
  coinSymbol: string;
  amount: number;
  priceUsd: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly txRepo: Repository<TransactionEntity>,
  ) {}

  async create(userId: string, data: CreateTransactionData): Promise<TransactionEntity> {
    const totalUsd = data.amount * data.priceUsd;
    const tx = this.txRepo.create({
      userId,
      type: data.type,
      coinSymbol: data.coinSymbol.toUpperCase(),
      amount: data.amount,
      priceUsd: data.priceUsd,
      totalUsd,
      status: 'completed',
    });
    return this.txRepo.save(tx);
  }

  async findByUser(userId: string, limit = 50, offset = 0): Promise<{ data: TransactionEntity[]; total: number }> {
    const [data, total] = await this.txRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
    return { data, total };
  }

  async findById(id: string, userId: string): Promise<TransactionEntity> {
    const tx = await this.txRepo.findOne({ where: { id, userId } });
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx;
  }

  toDto(tx: TransactionEntity) {
    return {
      id: tx.id,
      type: tx.type,
      coinSymbol: tx.coinSymbol,
      amount: Number(tx.amount),
      priceUsd: Number(tx.priceUsd),
      totalUsd: Number(tx.totalUsd),
      txHash: tx.txHash,
      status: tx.status,
      createdAt: tx.createdAt,
    };
  }
}
