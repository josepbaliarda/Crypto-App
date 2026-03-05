import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [TransactionsModule, MarketModule],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
