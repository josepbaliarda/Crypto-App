import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { WalletEntity } from '../wallets/entities/wallet.entity';
import { TransactionEntity } from '../transactions/entities/transaction.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
  username: process.env.DATABASE_USER ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'crypto_app',
  entities: [UserEntity, WalletEntity, TransactionEntity],
  synchronize: true,
  logging: false,
});
