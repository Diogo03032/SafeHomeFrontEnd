import { renderHook, act } from '@testing-library/react-native';
import { useSettingsVM, SETTINGS_ITEMS } from '@viewmodels/useSettingsVM';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('useSettingsVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar os itens de configuração', async () => {
    const hook = await renderHook(() => useSettingsVM());

    expect(hook.result.current.itens).toEqual(SETTINGS_ITEMS);
    expect(hook.result.current.itens).toHaveLength(4);
  });

  test('deve navegar para a rota informada', async() => {
    const hook = await renderHook(() => useSettingsVM());

    await act(async () => {
      await hook.result.current.irPara('Themes');
    });

    expect(mockNavigate).toHaveBeenCalledWith('Themes');
  });
});