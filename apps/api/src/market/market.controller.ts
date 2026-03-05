import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketService } from './market.service';

@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('coins')
  @ApiOperation({ summary: 'Get top coins by market cap' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopCoins(@Query('limit') limit?: string) {
    return this.marketService.getTopCoins(limit ? parseInt(limit) : 20);
  }

  @Get('coins/:id')
  @ApiOperation({ summary: 'Get coin detail' })
  async getCoinDetail(@Param('id') id: string) {
    return this.marketService.getCoinDetail(id);
  }

  @Get('coins/:id/chart')
  @ApiOperation({ summary: 'Get coin price chart data' })
  @ApiQuery({ name: 'days', required: false })
  async getCoinChart(@Param('id') id: string, @Query('days') days?: string) {
    return this.marketService.getCoinChart(id, days ? parseInt(days) : 7);
  }
}
