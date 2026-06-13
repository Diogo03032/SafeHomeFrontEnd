import { renderHook, act } from '@testing-library/react-native';
import { useLoginVM } from '../viewmodels/useLoginVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn((selector) =>
    selector({
      login: jest.fn(),
    })
  ),
}));

describe('useLoginVM', () => {
  test('deve alterar o email', async () => {
    const hook = await renderHook(() => useLoginVM());

    await act(async () => {
      hook.result.current.setEmail('teste@email.com');
    });

    expect(hook.result.current.email).toBe('teste@email.com');
  });

  test('deve alterar a senha', async () => {
    const hook = await renderHook(() => useLoginVM());

    await act(async () => {
      hook.result.current.setSenha('123456');
    });

    expect(hook.result.current.senha).toBe('123456');
  });
});