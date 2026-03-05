import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export type TransactionType = 'buy' | 'sell' | 'send' | 'receive';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: ['buy', 'sell', 'send', 'receive'] })
  type: TransactionType;

  @Column({ name: 'coin_symbol' })
  coinSymbol: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({ name: 'price_usd', type: 'decimal', precision: 18, scale: 2 })
  priceUsd: number;

  @Column({ name: 'total_usd', type: 'decimal', precision: 18, scale: 2 })
  totalUsd: number;

  @Column({ name: 'tx_hash', type: 'varchar', nullable: true })
  txHash: string | null;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: TransactionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
