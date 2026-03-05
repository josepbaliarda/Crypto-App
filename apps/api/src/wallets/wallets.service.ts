import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import * as crypto from 'crypto';
import { WalletEntity } from './entities/wallet.entity';

const ENCRYPTION_KEY = process.env.JWT_SECRET ?? 'super-secret-jwt-key-change-in-prod-32b';

function encrypt(text: string): string {
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletsRepo: Repository<WalletEntity>,
  ) {}

  async createWallet(userId: string, network = 'sepolia'): Promise<WalletEntity> {
    const ethWallet = ethers.Wallet.createRandom();
    const encryptedKey = encrypt(ethWallet.privateKey);

    const wallet = this.walletsRepo.create({
      userId,
      address: ethWallet.address,
      encryptedPrivateKey: encryptedKey,
      network,
    });
    return this.walletsRepo.save(wallet);
  }

  async getWalletsByUser(userId: string): Promise<WalletEntity[]> {
    return this.walletsRepo.find({ where: { userId } });
  }

  async getWalletById(id: string, userId: string): Promise<WalletEntity> {
    const wallet = await this.walletsRepo.findOne({ where: { id, userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getOrCreateWallet(userId: string): Promise<WalletEntity> {
    const wallets = await this.getWalletsByUser(userId);
    if (wallets.length > 0) return wallets[0];
    return this.createWallet(userId);
  }

  async getBalance(walletId: string, userId: string): Promise<{ address: string; balance: string; network: string }> {
    const wallet = await this.getWalletById(walletId, userId);
    let balance = '0';

    try {
      const rpcUrl = process.env.ETHEREUM_RPC_URL;
      if (rpcUrl && !rpcUrl.includes('YOUR_KEY')) {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const raw = await provider.getBalance(wallet.address);
        balance = ethers.formatEther(raw);
      }
    } catch {
      balance = '0';
    }

    return { address: wallet.address, balance, network: wallet.network };
  }

  toDto(wallet: WalletEntity) {
    return {
      id: wallet.id,
      address: wallet.address,
      network: wallet.network,
      createdAt: wallet.createdAt,
    };
  }
}
