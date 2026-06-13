import { renderHook } from '@testing-library/react-native';
import { useIotVM } from '../viewmodels/useIotVM';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useIotVM', () => {
  test('deve iniciar sem dispositivos', async () => {
    const hook = await renderHook(() => useIotVM());

    expect(hook.result.current.dispositivos).toEqual([]);
  });

  test('deve iniciar com zero dispositivos ativos', async () => {
    const hook = await renderHook(() => useIotVM());

    expect(hook.result.current.totalAtivos).toBe(0);
  });
});