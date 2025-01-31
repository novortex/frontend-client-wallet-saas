import { instance } from '@/config/api';
import {
  getWalletOrganization,
  getInfosCustomer,
  registerWalletForCustomer,
  updateCurrentAmount,
  requestCloseWallet,
  getGraphData,
  requestStartWallet,
  calculateRebalanceInWallet,
} from '../../../services/wallet/walleInfoService';

jest.mock('@/config/api', () => ({
  instance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

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
