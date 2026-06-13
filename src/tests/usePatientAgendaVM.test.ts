import { renderHook, act } from '@testing-library/react-native';
import { usePatientAgendaVM } from '../viewmodels/usePatientAgendaVM';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: {
      idPaciente: 1,
      nomePaciente: 'João',
      podeEditar: true,
    },
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@services/agendaService', () => ({
  listOccurrencesByDate: jest.fn(),
  listOccurrences: jest.fn(),
  markOccurrenceAsDone: jest.fn(),
}));

describe('usePatientAgendaVM', () => {
  test('deve carregar dados da rota', async () => {
    const hook = await renderHook(() => usePatientAgendaVM());

    expect(hook.result.current.idPaciente).toBe(1);
    expect(hook.result.current.nomePaciente).toBe('João');
    expect(hook.result.current.podeEditar).toBe(true);
  });

  test('deve alterar a data selecionada', async () => {
    const hook = await renderHook(() => usePatientAgendaVM());

    await act(async () => {
      hook.result.current.mudarData('2026-06-12');
    });

    expect(hook.result.current.dataSelecionada).toBe('2026-06-12');
  });
});