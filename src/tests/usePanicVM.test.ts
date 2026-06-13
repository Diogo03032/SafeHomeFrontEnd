import { renderHook, act } from '@testing-library/react-native';
import { usePanicVM } from '@viewmodels/usePanicVM';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 'Balanced',
  },
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: {
    Warning: 'Warning',
    Success: 'Success',
    Error: 'Error',
  },
  ImpactFeedbackStyle: {
    Light: 'Light',
    Heavy: 'Heavy',
  },
}));

describe('usePanicVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve voltar para a tela anterior ao cancelar', async () => {
    const hook = await renderHook(() => usePanicVM());

    await act(async () => {
      await hook.result.current.cancelar();
    });

    expect(mockGoBack).toHaveBeenCalled();
  });
});