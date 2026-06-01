import { useEffect, useState } from 'react';
import * as storage from '@services/storageService';
import { STORAGE_KEYS } from '@constants/storage';

export type FontSize = 1 | 2 | 3 | 4;

export const FONT_SIZE_LABELS: Record<FontSize, string> = {
    1: 'Pequena',
    2: 'Normal',
    3: 'Grande',
    4: 'Muito grande',
};

export function useAccessibilityVM() {
    // Estados
    const [fontSize, setFontSizeState] = useState<FontSize>(2);
    const [emergencyNarration, setEmergencyNarrationState] = useState(false);
    const [reduceMotion, setReduceMotionState] = useState(false);
    const [highContrast, setHighContrastState] = useState(false);
    const [colorBlindMode, setColorBlindModeState] = useState(false);

    // Carrega do storage ao montar
    useEffect(() => {
        (async () => {
            const fs = await storage.getPreference(STORAGE_KEYS.LOCAL.FONT_SIZE);
            const en = await storage.getBoolPreference(STORAGE_KEYS.LOCAL.EMERGENCY_NARRATION, false);
            const rm = await storage.getBoolPreference(STORAGE_KEYS.LOCAL.REDUCE_MOTION, false);
            const hc = await storage.getBoolPreference(STORAGE_KEYS.LOCAL.HIGH_CONTRAST, false);

            if (fs) setFontSizeState(parseInt(fs, 10) as FontSize);
            setEmergencyNarrationState(en);
            setReduceMotionState(rm);
            setHighContrastState(hc);
        })();
    }, []);

    // Setters que persistem no storage
    const setFontSize = async (size: FontSize) => {
        setFontSizeState(size);
        await storage.setPreference(STORAGE_KEYS.LOCAL.FONT_SIZE, String(size));
    };

    const setEmergencyNarration = async (value: boolean) => {
        setEmergencyNarrationState(value);
        await storage.setBoolPreference(STORAGE_KEYS.LOCAL.EMERGENCY_NARRATION, value);
    };

    const setReduceMotion = async (value: boolean) => {
        setReduceMotionState(value);
        await storage.setBoolPreference(STORAGE_KEYS.LOCAL.REDUCE_MOTION, value);
    };

    const setHighContrast = async (value: boolean) => {
        setHighContrastState(value);
        await storage.setBoolPreference(STORAGE_KEYS.LOCAL.HIGH_CONTRAST, value);
    };

    const setColorBlindMode = (value: boolean) => {
        setColorBlindModeState(value);
        // Não persiste por enquanto (próxima sprint)
    };

    return {
        fontSize,
        fontSizeLabel: FONT_SIZE_LABELS[fontSize],
        emergencyNarration,
        reduceMotion,
        highContrast,
        colorBlindMode,
        setFontSize,
        setEmergencyNarration,
        setReduceMotion,
        setHighContrast,
        setColorBlindMode,
    };
}