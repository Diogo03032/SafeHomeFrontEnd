import { renderHook, act } from '@testing-library/react-native';
import { useAddDeviceVM } from '../viewmodels/useAddDeviceVM';
import * as iotService from '@services/iotService';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('@services/iotService', () => ({
  createDevice: jest.fn(),
}));

describe('useAddDeviceVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve exibir erros quando os campos estiverem vazios', async () => {
    const hook = await renderHook(() => useAddDeviceVM());

    await act(async () => {
      await hook.result.current.salvar();
    });

    expect(hook.result.current.erros.id).toBeDefined();
    expect(hook.result.current.erros.nome).toBeDefined();
  });

});