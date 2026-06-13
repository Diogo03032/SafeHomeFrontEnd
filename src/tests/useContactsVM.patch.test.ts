import { renderHook, act } from '@testing-library/react-native';
import { useContactsVM } from '../viewmodels/useContactsVM.patch';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@services/userService', () => ({
  listContacts: jest.fn(),
  listMonitored: jest.fn(),
  updateContactPermission: jest.fn(),
  removeContact: jest.fn(),
}));

describe('useContactsVM', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

    test('deve abrir o sheet de convite', async () => {
        const hook = await renderHook(() => useContactsVM());

        await act(async () => {
            await hook.result.current.abrirSheet();
        });

        expect(hook.result.current.sheetVisivel).toBe(true);
    });

    test('deve fechar o sheet de convite', async () => {
        const hook = await renderHook(() => useContactsVM());

        await act(async () => {
            await hook.result.current.abrirSheet();
        });

        await act(async () => {
            await hook.result.current.fecharSheet();
        });

        expect(hook.result.current.sheetVisivel).toBe(false);
    });
});