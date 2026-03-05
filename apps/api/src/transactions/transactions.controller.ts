import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { TransactionType } from './entities/transaction.entity';

class CreateTxDto {
  @ApiProperty({ enum: ['buy', 'sell', 'send', 'receive'] })
  @IsEnum(['buy', 'sell', 'send', 'receive'])
  type: TransactionType;

  @ApiProperty({ example: 'ETH' })
  @IsString()
  coinSymbol: string;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 3000.0 })
  @IsNumber()
  @Min(0)
  priceUsd: number;
}

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a buy/sell/send/receive transaction' })
  async create(@Body() dto: CreateTxDto, @Request() req: any) {
    const tx = await this.txService.create(req.user.id, dto);
    return this.txService.toDto(tx);
  }

  @Get()
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getAll(
    @Request() req: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const result = await this.txService.findByUser(
      req.user.id,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
    return {
      data: result.data.map((tx) => this.txService.toDto(tx)),
      total: result.total,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific transaction' })
  async getOne(@Param('id') id: string, @Request() req: any) {
    const tx = await this.txService.findById(id, req.user.id);
    return this.txService.toDto(tx);
  }
}
