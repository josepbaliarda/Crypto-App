import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('wallets')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  address: string;

  @Column({ name: 'encrypted_private_key', type: 'text' })
  encryptedPrivateKey: string;

  @Column({ default: 'sepolia' })
  network: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
