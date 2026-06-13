import { renderHook } from '@testing-library/react-native';
import { usePatientViewVM } from '../viewmodels/usePatientViewVM';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: {
      idPaciente: 1,
      nomePaciente: 'João',
      nivelPermissao: 'TOTAL',
    },
  }),
  useFocusEffect: jest.fn(),
}));

describe('usePatientViewVM', () => {
  test('deve retornar acesso total corretamente', async () => {
    const { result } = await renderHook(() => usePatientViewVM());

    expect(result.current.podeVerPainel).toBe(true);
    expect(result.current.podeEditar).toBe(true);
  });

  test('deve retornar label do nível TOTAL', async () => {
    const { result } = await renderHook(() => usePatientViewVM());

    expect(result.current.labelNivel()).toBe('Acesso total');
  });
});