import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAgendaVM } from '../viewmodels/useAgendaVM';
import { Alert } from 'react-native';
import * as agendaService from '@services/agendaService';
import { useAppStore } from '@store/useAppStore';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// CORREÇÃO CRÍTICA: Simula o useFocusEffect usando useEffect para evitar loops infinitos
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useFocusEffect: (effect: () => void) => {
      React.useEffect(() => {
        effect();
      }, [effect]);
    },
  };
});

jest.mock('@store/useAppStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('@services/agendaService', () => ({
  listOccurrencesByDate: jest.fn(),
  listMonthlyNotes: jest.fn(),
  markOccurrenceAsDone: jest.fn(),
  addMonthlyNote: jest.fn(),
}));

const mockListOccurrencesByDate = agendaService.listOccurrencesByDate as jest.MockedFunction<typeof agendaService.listOccurrencesByDate>;
const mockListMonthlyNotes = agendaService.listMonthlyNotes as jest.MockedFunction<typeof agendaService.listMonthlyNotes>;
const mockMarkOccurrenceAsDone = agendaService.markOccurrenceAsDone as jest.MockedFunction<typeof agendaService.markOccurrenceAsDone>;
const mockAddMonthlyNote = agendaService.addMonthlyNote as jest.MockedFunction<typeof agendaService.addMonthlyNote>;

describe('useAgendaVM', () => {
  const mockUser = { id_usuario: 'user-123', name: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as unknown as jest.Mock).mockReturnValue(mockUser);
  });

  test('não deve buscar dados se o usuário não estiver logado', async () => {
    (useAppStore as unknown as jest.Mock).mockReturnValue(null);

    const { result } = await renderHook(() => useAgendaVM()); 

    expect(mockListOccurrencesByDate).not.toHaveBeenCalled();
    expect(mockListMonthlyNotes).not.toHaveBeenCalled();
    expect(result.current.carregando).toBe(true);
  });

  test('deve carregar ocorrências e notas com sucesso na inicialização', async () => {
    const mockOcorrencias = [
      { id_ocorrencia: '1', status_concluido: false },
      { id_ocorrencia: '2', status_concluido: true },
    ];
    const mockNotas = [{ id_nota: 'n1', texto: 'Nota 1' }];

    mockListOccurrencesByDate.mockResolvedValue(mockOcorrencias as any);
    mockListMonthlyNotes.mockResolvedValue(mockNotas as any);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.ocorrencias).toEqual(mockOcorrencias);
    expect(result.current.notas).toEqual(mockNotas);
    expect(result.current.totalOcorrencias).toBe(2);
    expect(result.current.totalConcluidas).toBe(1);
    expect(result.current.percentualConcluido).toBe(50);
  });

  test('deve tratar erro na listagem de dados graciosamente', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockListOccurrencesByDate.mockRejectedValue(new Error('Erro na API'));
    mockListMonthlyNotes.mockRejectedValue(new Error('Erro Notas'));

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.ocorrencias).toEqual([]);
    expect(result.current.notas).toEqual([]);

    spyWarn.mockRestore();
  });

  test('deve mudar a data selecionada', async () => {
    mockListOccurrencesByDate.mockResolvedValue([]);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      result.current.mudarData('2026-12-25');
    });

    expect(result.current.dataSelecionada).toBe('2026-12-25');
  });

  test('deve otimisticamente alternar o status concluído e reverter em caso de falha da API', async () => {
    const ocorrenciaInicial = { id_ocorrencia: '1', status_concluido: false };
    mockListOccurrencesByDate.mockResolvedValue([ocorrenciaInicial] as any);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.ocorrencias.length).toBe(1);
    });

    mockMarkOccurrenceAsDone.mockRejectedValue(new Error('Erro de Conexão'));

    await act(async () => {
      await result.current.alternarConcluido(result.current.ocorrencias[0]);
    });

    expect(result.current.ocorrencias[0].status_concluido).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Não foi possível atualizar o status. Tente novamente.');
  });

  test('deve alternar status concluído com sucesso mantendo a atualização da API', async () => {
    const ocorrenciaInicial = { id_ocorrencia: '1', status_concluido: false };
    mockListOccurrencesByDate.mockResolvedValue([ocorrenciaInicial] as any);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.ocorrencias.length).toBe(1);
    });

    mockMarkOccurrenceAsDone.mockResolvedValue(undefined as any);

    await act(async () => {
      await result.current.alternarConcluido(result.current.ocorrencias[0]);
    });

    expect(result.current.ocorrencias[0].status_concluido).toBe(true);
    expect(mockMarkOccurrenceAsDone).toHaveBeenCalledWith('1', true);
  });

  test('deve validar campo vazio ao tentar adicionar uma nota', async () => {
    mockListOccurrencesByDate.mockResolvedValue([]);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      result.current.setNovaNota('   ');
    });

    await act(async () => {
      await result.current.adicionarNota();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Atenção', 'Escreva algo na nota antes de salvar.');
    expect(mockAddMonthlyNote).not.toHaveBeenCalled();
  });

  test('deve validar limite máximo de caracteres da nota', async () => {
    mockListOccurrencesByDate.mockResolvedValue([]);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      result.current.setNovaNota('a'.repeat(501));
    });

    await act(async () => {
      await result.current.adicionarNota();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Atenção', 'A nota pode ter no máximo 500 caracteres.');
    expect(mockAddMonthlyNote).not.toHaveBeenCalled();
  });

  test('deve adicionar nota com sucesso e recarregar os dados da tela', async () => {
    mockListOccurrencesByDate.mockResolvedValue([]);
    mockListMonthlyNotes.mockResolvedValue([]);

    const { result } = await renderHook(() => useAgendaVM()); 

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    await act(async () => {
      result.current.setNovaNota('Minha nova nota de teste');
    });

    mockAddMonthlyNote.mockResolvedValue(undefined as any);

    await act(async () => {
      await result.current.adicionarNota();
    });

    expect(mockAddMonthlyNote).toHaveBeenCalledWith('user-123', expect.any(String), 'Minha nova nota de teste');
    expect(result.current.novaNota).toBe('');
    
    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });
  });
});