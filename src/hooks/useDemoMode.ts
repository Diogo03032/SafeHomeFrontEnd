import { useAppStore } from '@store/useAppStore';

export function useDemoMode(): boolean {
    const token = useAppStore((s) => s.token);
    return token === 'token-demo-fake-123';
}