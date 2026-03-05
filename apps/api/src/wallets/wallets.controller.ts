import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletsService } from './wallets.service';

@ApiTags('wallets')
@Controller('wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all wallets for current user' })
  async getWallets(@Request() req: any) {
    const wallets = await this.walletsService.getWalletsByUser(req.user.id);
    return wallets.map((w) => this.walletsService.toDto(w));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new Ethereum wallet' })
  async createWallet(@Request() req: any) {
    const wallet = await this.walletsService.createWallet(req.user.id);
    return this.walletsService.toDto(wallet);
  }

  @Get('primary')
  @ApiOperation({ summary: 'Get or create primary wallet' })
  async getPrimaryWallet(@Request() req: any) {
    const wallet = await this.walletsService.getOrCreateWallet(req.user.id);
    return this.walletsService.toDto(wallet);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get ETH balance for a wallet' })
  async getBalance(@Param('id') id: string, @Request() req: any) {
    return this.walletsService.getBalance(id, req.user.id);
  }
}
