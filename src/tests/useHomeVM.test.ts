import { renderHook } from '@testing-library/react-native';
import { useHomeVM } from '../viewmodels/useHomeVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn((selector) =>
    selector({
      user: {
        nome: 'Diogo Lomasso',
      },
    })
  ),
}));

describe('useHomeVM', () => {
  test('deve retornar o primeiro nome do usuário', async () => {
    const hook = await renderHook(() => useHomeVM());

    expect(hook.result.current.primeiroNome).toBe('Diogo');
  });

  test('deve retornar uma saudação válida', async () => {
    const hook = await renderHook(() => useHomeVM());

    expect([
      'Bom dia',
      'Boa tarde',
      'Boa noite',
    ]).toContain(hook.result.current.saudacao);
  });
});