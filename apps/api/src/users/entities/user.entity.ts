import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { WalletEntity } from '../../wallets/entities/wallet.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'pin_hash', type: 'varchar', nullable: true })
  pinHash: string | null;

  @Column({ name: 'is_2fa_enabled', default: false })
  is2faEnabled: boolean;

  @Column({ name: 'totp_secret', type: 'varchar', nullable: true })
  totpSecret: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user)
  wallets: WalletEntity[];

  @OneToMany(() => TransactionEntity, (tx) => tx.user)
  transactions: TransactionEntity[];
}
