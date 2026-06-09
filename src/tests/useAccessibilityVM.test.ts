import { renderHook, act, waitFor } from '@testing-library/react';
import { useAccessibilityVM, FONT_SIZE_LABELS } from '../viewmodels/useAccessibilityVM';  
import * as storage from '@services/storageService';
import { STORAGE_KEYS } from '@constants/storage';

jest.mock('@services/storageService', () => ({
  getPreference: jest.fn(),
  getBoolPreference: jest.fn(),
  setPreference: jest.fn(),
  setBoolPreference: jest.fn(),
}));

const mockGetPreference = storage.getPreference as jest.MockedFunction<typeof storage.getPreference>;
const mockGetBoolPreference = storage.getBoolPreference as jest.MockedFunction<typeof storage.getBoolPreference>;

describe('useAccessibilityVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve inicializar com os valores padrão quando o storage estiver vazio', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.fontSize).toBe(2);
    });

    expect(result.current.fontSizeLabel).toBe(FONT_SIZE_LABELS[2]);
    expect(result.current.emergencyNarration).toBe(false);
    expect(result.current.reduceMotion).toBe(false);
    expect(result.current.highContrast).toBe(false);
    expect(result.current.colorBlindMode).toBe(false);
  });

  test('deve inicializar com os valores vindos do storage', async () => {
    mockGetPreference.mockResolvedValue('3');
    mockGetBoolPreference.mockImplementation((key) => {
      if (key === STORAGE_KEYS.LOCAL.EMERGENCY_NARRATION) return Promise.resolve(true);
      if (key === STORAGE_KEYS.LOCAL.REDUCE_MOTION) return Promise.resolve(true);
      if (key === STORAGE_KEYS.LOCAL.HIGH_CONTRAST) return Promise.resolve(true);
      return Promise.resolve(false);
    });

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.fontSize).toBe(3);
    });

    expect(result.current.fontSizeLabel).toBe(FONT_SIZE_LABELS[3]);
    expect(result.current.emergencyNarration).toBe(true);
    expect(result.current.reduceMotion).toBe(true);
    expect(result.current.highContrast).toBe(true);
  });

  test('deve atualizar o tamanho da fonte e salvar no storage', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.fontSize).toBe(2);
    });

    await act(async () => {
      await result.current.setFontSize(4);
    });

    expect(result.current.fontSize).toBe(4);
    expect(result.current.fontSizeLabel).toBe(FONT_SIZE_LABELS[4]);
    expect(storage.setPreference).toHaveBeenCalledWith(STORAGE_KEYS.LOCAL.FONT_SIZE, '4');
  });

  test('deve atualizar a narração de emergência e salvar no storage', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.emergencyNarration).toBe(false);
    });

    await act(async () => {
      await result.current.setEmergencyNarration(true);
    });

    expect(result.current.emergencyNarration).toBe(true);
    expect(storage.setBoolPreference).toHaveBeenCalledWith(STORAGE_KEYS.LOCAL.EMERGENCY_NARRATION, true);
  });

  test('deve atualizar a redução de movimento e salvar no storage', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.reduceMotion).toBe(false);
    });

    await act(async () => {
      await result.current.setReduceMotion(true);
    });

    expect(result.current.reduceMotion).toBe(true);
    expect(storage.setBoolPreference).toHaveBeenCalledWith(STORAGE_KEYS.LOCAL.REDUCE_MOTION, true);
  });

  test('deve atualizar o alto contraste e salvar no storage', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.highContrast).toBe(false);
    });

    await act(async () => {
      await result.current.setHighContrast(true);
    });

    expect(result.current.highContrast).toBe(true);
    expect(storage.setBoolPreference).toHaveBeenCalledWith(STORAGE_KEYS.LOCAL.HIGH_CONTRAST, true);
  });

  test('deve atualizar o modo daltônico mas NÃO salvar no storage', async () => {
    mockGetPreference.mockResolvedValue(null);
    mockGetBoolPreference.mockResolvedValue(false);

    const { result } = renderHook(() => useAccessibilityVM());

    await waitFor(() => {
      expect(result.current.colorBlindMode).toBe(false);
    });

    act(() => {
      result.current.setColorBlindMode(true);
    });

    expect(result.current.colorBlindMode).toBe(true);
    expect(storage.setPreference).not.toHaveBeenCalled();
    expect(storage.setBoolPreference).not.toHaveBeenCalled();
  });
});