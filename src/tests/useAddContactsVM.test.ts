import { renderHook, act } from '@testing-library/react-native';
import { useAddContactVM } from '../viewmodels/useAddContactVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn(() => ({
    id_usuario: 1,
  })),
}));

jest.mock('@services/userService', () => ({
  searchUser: jest.fn(),
  addContact: jest.fn(),
}));

describe('useAddContactVM', () => {
  test('deve exibir erro ao buscar email inválido', async () => {
    const hook = await renderHook(() => useAddContactVM());

    await act(async () => {
      hook.result.current.setEmail('email-invalido');
      await hook.result.current.buscar();
    });

    expect(hook.result.current.erroBusca).toBe(
      'Digite um email válido.'
    );
  });

  test('deve limpar os dados da busca', async () => {
    const hook = await renderHook(() => useAddContactVM());

    await act(async () => {
      hook.result.current.setEmail('teste@email.com');
      hook.result.current.limparBusca();
    });

    expect(hook.result.current.email).toBe('');
    expect(hook.result.current.erroBusca).toBeNull();
    expect(hook.result.current.usuarioEncontrado).toBeNull();
  });
});