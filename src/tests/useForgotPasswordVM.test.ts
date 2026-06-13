import { renderHook, act } from '@testing-library/react-native';
import { useForgotPasswordVM } from '../viewmodels/useForgotPasswordVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('useForgotPasswordVM', () => {
  test('deve alterar o email', async () => {
    const hook = await renderHook(() => useForgotPasswordVM());

    await act(async () => {
      hook.result.current.setEmail('teste@email.com');
    });

    expect(hook.result.current.email).toBe('teste@email.com');
  });

  test('deve alterar a nova senha', async () => {
    const hook = await renderHook(() => useForgotPasswordVM());

    await act(async () => {
      hook.result.current.setNovaSenha('123456');
    });

    expect(hook.result.current.novaSenha).toBe('123456');
  });
});