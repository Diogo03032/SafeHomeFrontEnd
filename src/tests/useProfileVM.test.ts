import { renderHook } from '@testing-library/react-native';
import { useProfileVM, OPCOES_GENERO } from '../viewmodels/useProfileVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('@store/useAppStore', () => ({
  useAppStore: (selector: any) =>
    selector({
      user: {
        nome: 'João Silva',
      },
      setUser: jest.fn(),
    }),
}));

jest.mock('@services/userService', () => ({
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
}));

describe('useProfileVM', () => {
  test('deve retornar o primeiro nome do usuário', async () => {
    const { result } = await renderHook(() => useProfileVM());

    expect(result.current.primeiroNome).toBe('João');
  });

  test('deve possuir opções de gênero', async () => {
    const { result } = await renderHook(() => useProfileVM());

    expect(result.current.opcoesGenero).toEqual(OPCOES_GENERO);
    expect(result.current.opcoesGenero.length).toBe(4);
  });
});