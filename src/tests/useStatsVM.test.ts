import { renderHook } from '@testing-library/react-native';
import { useStatsVM } from '@viewmodels/useStatsVM';

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn((selector) =>
    selector({
      user: {
        id_usuario: 1,
        nome: 'Diogo',
      },
    })
  ),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useStatsVM', () => {
  test('deve retornar estado inicial', async () => {
    const hook = await renderHook(() => useStatsVM());

    expect(hook.result.current.user?.id_usuario).toBe(1);
    expect(hook.result.current.stats).toBeNull();
    expect(hook.result.current.carregando).toBe(true);
  });

  test('deve retornar valores padrão quando não há estatísticas', async () => {
    const hook = await renderHook(() => useStatsVM());

    expect(hook.result.current.corConsistencia).toBe('#999');
    expect(hook.result.current.labelConsistencia).toBe('');
    expect(hook.result.current.diasEstabilidadeLabel).toBe('');
    expect(hook.result.current.ultimoAlertaFormatado).toBe(
      'Nenhum alerta crítico até agora 🌟'
    );
  });
});