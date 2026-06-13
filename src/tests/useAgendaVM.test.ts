import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useAgendaVM } from '../viewmodels/useAgendaVM';

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn(() => ({
    id_usuario: 1,
  })),
}));

jest.mock('@services/agendaService', () => ({
  listOccurrencesByDate: jest.fn(),
  listMonthlyNotes: jest.fn(),
  listOccurrences: jest.fn(),
  markOccurrenceAsDone: jest.fn(),
  deleteTemplate: jest.fn(),
  deleteMonthlyNote: jest.fn(),
  addMonthlyNote: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

describe('useAgendaVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve alterar a data selecionada', async () => {
    const hook = await renderHook(() => useAgendaVM());

    await act(async () => {
      hook.result.current.mudarData('2026-06-15');
    });

    expect(hook.result.current.dataSelecionada).toBe('2026-06-15');
  });

  test('não deve adicionar nota vazia', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const hook = await renderHook(() => useAgendaVM());

    await act(async () => {
      await hook.result.current.adicionarNota();
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Atenção',
      'Escreva algo na nota antes de salvar.'
    );

    alertSpy.mockRestore();
  });
});