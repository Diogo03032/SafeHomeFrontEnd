import { renderHook, act } from '@testing-library/react-native';
import { useAccessibilityVM } from '../viewmodels/useAccessibilityVM';
import * as storage from '@services/storageService';

jest.mock('@services/storageService', () => ({
  getPreference: jest.fn(),
  getBoolPreference: jest.fn(),
  setPreference: jest.fn(),
  setBoolPreference: jest.fn(),
}));

describe('useAccessibilityVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (storage.getPreference as jest.Mock).mockResolvedValue(null);
    (storage.getBoolPreference as jest.Mock).mockResolvedValue(false);
  });

  it('deve iniciar com valores padrão', async () => {
    const { result } = await renderHook(() => useAccessibilityVM());

    expect(result.current.fontSize).toBe(2);
    expect(result.current.fontSizeLabel).toBe('Normal');
    expect(result.current.emergencyNarration).toBe(false);
    expect(result.current.reduceMotion).toBe(false);
    expect(result.current.highContrast).toBe(false);
    expect(result.current.colorBlindMode).toBe(false);
  });

  it('deve alterar o tamanho da fonte e salvar no storage', async () => {
    const { result } = await renderHook(() => useAccessibilityVM());

    await act(async () => {
      await result.current.setFontSize(4);
    });

    expect(result.current.fontSize).toBe(4);
    expect(result.current.fontSizeLabel).toBe('Muito grande');

    expect(storage.setPreference).toHaveBeenCalledWith(
      expect.any(String),
      '4'
    );
  });
});