import { renderHook, act } from '@testing-library/react-native';
import { useCreateEventVM } from '../viewmodels/useCreateEventVM';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn((selector) =>
    selector({
      user: {
        id_usuario: 1,
      },
    })
  ),
}));

describe('useCreateEventVM', () => {
  test('deve alterar o título', async () => {
    const hook = await renderHook(() => useCreateEventVM());

    await act(async () => {
      hook.result.current.setTitulo('Consulta médica');
    });

    expect(hook.result.current.titulo).toBe('Consulta médica');
  });

  test('deve alterar a descrição', async () => {
    const hook = await renderHook(() => useCreateEventVM());

    await act(async () => {
      hook.result.current.setDescricao('Levar exames');
    });

    expect(hook.result.current.descricao).toBe('Levar exames');
  });
});