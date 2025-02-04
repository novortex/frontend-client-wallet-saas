import { instance } from '@/config/api';
import {
  getAllAssetsWalletClient,
  updateAssetWalletInformations,
  addCryptoWalletClient,
  createDepositWithdrawal,
  deleteAssetWallet,
  rebalanceWallet,
  getAllAssetsInOrgForAddWalletClient,
} from '@/services/wallet/walletAssetService'
import { calculateRebalanceInWallet, getGraphData, getInfosCustomer, getWalletOrganization, registerWalletForCustomer, requestCloseWallet, requestStartWallet, updateCurrentAmount } from '@/services/wallet/walleInfoService';

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('walletAssetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all assets for a wallet client', async () => {
    const mockData = { assets: [{ id: '1', name: 'Bitcoin' }] };
    (instance.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await getAllAssetsWalletClient('123');
    expect(result).toEqual(mockData);
    expect(instance.get).toHaveBeenCalledWith('wallet/123/walletAssets');
  });

  it('should handle error when fetching assets', async () => {
    (instance.get as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(getAllAssetsWalletClient('123')).rejects.toThrow('Network error');
  });

  it('should update asset wallet information', async () => {
    const mockData = { success: true };
    (instance.put as jest.Mock).mockResolvedValue({ data: mockData });
    await updateAssetWalletInformations('123', '456', 10, 20);
    expect(instance.put).toHaveBeenCalledWith('wallet/123/asset', { assetUuid: '456', quantity: 10, targetAllocation: 20 });
  });

  it('should handle error when updating asset wallet information with invalid data', async () => {
    (instance.put as jest.Mock).mockRejectedValue(new Error('Invalid data'));
    await expect(updateAssetWalletInformations('123', '456', -10, 200)).rejects.toThrow('Invalid data');
  });

  it('should add crypto asset to wallet', async () => {
    const mockResponse = { success: true };
    (instance.post as jest.Mock).mockResolvedValue({ data: mockResponse });
    const result = await addCryptoWalletClient('123', '456', 10, 20);
    expect(result).toEqual(mockResponse);
    expect(instance.post).toHaveBeenCalledWith('wallet/123/asset', { assetUuid: '456', quantity: 10, targetAllocation: 20 });
  });

  it('should handle error when adding crypto asset with invalid data', async () => {
    (instance.post as jest.Mock).mockRejectedValue(new Error('Invalid asset data'));
    await expect(addCryptoWalletClient('123', '', -5, 150)).rejects.toThrow('Invalid asset data');
  });

  it('should create deposit or withdrawal', async () => {
    (instance.post as jest.Mock).mockResolvedValue({ data: {} });
    await createDepositWithdrawal(500, '123', 'USD', true);
    expect(instance.post).toHaveBeenCalledWith('wallet/deposit-withdrawal', { amount: 500, walletUuid: '123', currency: 'USD', isWithdrawal: true });
  });

  it('should delete asset from wallet', async () => {
    (instance.delete as jest.Mock).mockResolvedValue({ data: {} });
    await deleteAssetWallet('123', '456');
    expect(instance.delete).toHaveBeenCalledWith('wallet/123/assets/456');
  });

  it('should rebalance wallet', async () => {
    (instance.put as jest.Mock).mockResolvedValue({ data: {} });
    await rebalanceWallet('123');
    expect(instance.put).toHaveBeenCalledWith('wallet/123/rebalanceWallet', {});
  });

  it('should fetch all assets for adding to a wallet', async () => {
    const mockData = [{ id: '1', name: 'Ethereum' }];
    (instance.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await getAllAssetsInOrgForAddWalletClient();
    expect(result).toEqual(mockData);
    expect(instance.get).toHaveBeenCalledWith('wallet/assets');
  });

  it('should handle error when fetching available assets', async () => {
    (instance.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch assets'));
    await expect(getAllAssetsInOrgForAddWalletClient()).rejects.toThrow('Failed to fetch assets');
  });
});

describe('walleInfoService', () => {
  it('should fetch wallet organization', async () => {
    const mockData = [{ id: 1, name: 'Wallet Test' }];
    (instance.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await getWalletOrganization();
    expect(result).toEqual(mockData);
    expect(instance.get).toHaveBeenCalledWith('wallet');
  });

  it('should fetch customer information', async () => {
    const mockData = { id: '123', name: 'John Doe' };
    (instance.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await getInfosCustomer('123');
    expect(result).toEqual(mockData);
    expect(instance.get).toHaveBeenCalledWith('wallet/123/infos');
  });

  it('should register a wallet for a customer', async () => {
    const mockResponse = { success: true };
    (instance.post as jest.Mock).mockResolvedValue({ data: mockResponse });
    const result = await registerWalletForCustomer('123', 'USD', 1000, 10, true, 'Low', true, 5, 'cuid1', 'exchange1', 'manager1');
    expect(result).toEqual(mockResponse);
    expect(instance.post).toHaveBeenCalledWith('wallet', expect.any(Object));
  });

  it('should update current amount', async () => {
    (instance.put as jest.Mock).mockResolvedValue({ data: {} });
    await updateCurrentAmount('123');
    expect(instance.put).toHaveBeenCalledWith('wallet/123/currentAmount', {});
  });

  it('should request close wallet', async () => {
    (instance.put as jest.Mock).mockResolvedValue({ data: {} });
    await requestCloseWallet('123', { customDate: '2023-01-01' });
    expect(instance.put).toHaveBeenCalledWith('wallet/123/closeWallet', { customDate: '2023-01-01' });
  });

  it('should fetch graph data', async () => {
    const mockData = { graph: [] };
    (instance.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await getGraphData('123');
    expect(result).toEqual(mockData);
    expect(instance.get).toHaveBeenCalledWith('wallet/123/graphData');
  });

  it('should request start wallet', async () => {
    (instance.put as jest.Mock).mockResolvedValue({ data: {} });
    await requestStartWallet('123', { customDate: '2023-01-01' });
    expect(instance.put).toHaveBeenCalledWith('wallet/123/startWallet', { customDate: '2023-01-01' });
  });

  it('should calculate rebalance in wallet', async () => {
    const mockData = [{ asset: 'BTC', allocation: 50 }];
    (instance.post as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await calculateRebalanceInWallet('123');
    expect(result).toEqual(mockData);
    expect(instance.post).toHaveBeenCalledWith('wallet/123/rebalanceWallet', {});
  });
});
describe('walletAssetService', () => {
  it('should handle error when fetching assets', async () => {
    (instance.get as jest.Mock).mockImplementation(() => Promise.reject(new Error('Network error')));
    await expect(getAllAssetsWalletClient('123')).rejects.toThrow('Network error');
  });

  it('should handle error when updating asset wallet information with invalid data', async () => {
    (instance.put as jest.Mock).mockImplementation(() => Promise.reject(new Error('Invalid data')));
    await expect(updateAssetWalletInformations('123', '456', -10, 200)).rejects.toThrow('Invalid data');
  });

  it('should handle error when adding crypto asset with invalid data', async () => {
    (instance.post as jest.Mock).mockImplementation(() => Promise.reject(new Error('Invalid asset data')));
    await expect(addCryptoWalletClient('123', '', -5, 150)).rejects.toThrow('Invalid asset data');
  });

  it('should handle error when creating deposit or withdrawal with invalid data', async () => {
    (instance.post as jest.Mock).mockImplementation(() => Promise.reject(new Error('Invalid deposit data')));
    await expect(createDepositWithdrawal(-500, '123', 'INVALID', true)).rejects.toThrow('Invalid deposit data');
  });

  it('should handle error when deleting non-existent asset', async () => {
    (instance.delete as jest.Mock).mockImplementation(() => Promise.reject(new Error('Asset not found')));
    await expect(deleteAssetWallet('123', '999')).rejects.toThrow('Asset not found');
  });

  it('should handle error when rebalancing wallet with invalid data', async () => {
    (instance.put as jest.Mock).mockImplementation(() => Promise.reject(new Error('Rebalance failed')));
    await expect(rebalanceWallet('INVALID')).rejects.toThrow('Rebalance failed');
  });

  it('should handle error when fetching available assets', async () => {
    (instance.get as jest.Mock).mockImplementation(() => Promise.reject(new Error('Failed to fetch assets')));
    await expect(getAllAssetsInOrgForAddWalletClient()).rejects.toThrow('Failed to fetch assets');
  });
});