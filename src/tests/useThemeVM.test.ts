import { renderHook, act } from '@testing-library/react-native';
import { useThemeVM, MODOS, PALETAS } from '@viewmodels/useThemeVM';

const mockSetThemeMode = jest.fn();
const mockSetThemePalette = jest.fn();

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn((selector) =>
    selector({
      themePalette: 'forest',
      themeMode: 'system',
      setThemePalette: mockSetThemePalette,
      setThemeMode: mockSetThemeMode,
    })
  ),
}));

describe('useThemeVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve retornar os dados iniciais', async () => {
    const hook = await renderHook(() => useThemeVM());

    expect(hook.result.current.themePalette).toBe('forest');
    expect(hook.result.current.themeMode).toBe('system');
    expect(hook.result.current.modos).toEqual(MODOS);
    expect(hook.result.current.paletas).toEqual(PALETAS);
  });

  test('deve alterar modo e paleta', async () => {
    const hook = await renderHook(() => useThemeVM());

    await act(async () => {
      await hook.result.current.escolherModo('dark');
      await hook.result.current.escolherPaleta('ocean');
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');
    expect(mockSetThemePalette).toHaveBeenCalledWith('ocean');
  });
});