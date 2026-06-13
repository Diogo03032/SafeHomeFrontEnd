import { renderHook } from '@testing-library/react-native';
import { useRegisterVM, OPCOES_GENERO } from '../viewmodels/useRegisterVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@services/authService', () => ({
  register: jest.fn(),
}));

describe('useRegisterVM', () => {
  test('deve iniciar com campos vazios', async() => {
    const { result } = await renderHook(() => useRegisterVM());

    expect(result.current.nome).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.senha).toBe('');
    expect(result.current.confirmaSenha).toBe('');
  });

  test('deve retornar as opções de gênero', async() => {
    const { result } = await renderHook(() => useRegisterVM());

    expect(result.current.opcoesGenero).toEqual(OPCOES_GENERO);
    expect(result.current.opcoesGenero.length).toBe(4);
  });
});