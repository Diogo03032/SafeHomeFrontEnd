import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import * as panicService from '@services/panicService';
import type { RootStackParamList } from '@navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'PanicCountdown'>;

const COUNTDOWN_INITIAL = 5; // segundos

export function usePanicVM() {
    const navigation = useNavigation<Navigation>();

    const [contador, setContador] = useState(COUNTDOWN_INITIAL);
    const [acionando, setAcionando] = useState(false);
    const [acionado, setAcionado] = useState(false);
    const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number } | null>(null);

    // Refs pra controlar o timer e a captura de localização
    const intervalRef = useRef<any>(null);
    const localizacaoCapturada = useRef(false);

    // Captura localização em background (não bloqueia o countdown)
    const capturarLocalizacao = async () => {
        if (localizacaoCapturada.current) return;
        localizacaoCapturada.current = true;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('[usePanicVM] Sem permissão de localização');
                return;
            }

            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocalizacao({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
        } catch (error) {
            console.warn('[usePanicVM] Erro ao pegar localização:', error);
        }
    };

    // Inicia o countdown ao montar a tela
    useEffect(() => {
        // Captura localização em paralelo
        capturarLocalizacao();

        // Vibração inicial
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        intervalRef.current = setInterval(() => {
            setContador((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    acionarAgora();
                    return 0;
                }
                // Vibração a cada segundo
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Chamado quando o countdown chega a 0
    const acionarAgora = async () => {
        setAcionando(true);

        try {
            await panicService.triggerPanic({
                latitude: localizacao?.lat ?? null,
                longitude: localizacao?.lng ?? null,
                origem: 'MANUAL',
            });

            // Vibração de sucesso
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            setAcionado(true);
        } catch (error: any) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            Alert.alert(
                'Erro',
                'Não foi possível acionar o pânico. Verifique sua conexão e tente novamente.',
                [{ text: 'Voltar', onPress: () => navigation.goBack() }]
            );
        } finally {
            setAcionando(false);
        }
    };

    // Cancela o countdown ANTES de zerar
    const cancelar = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

    // Volta pra Home depois que o pânico foi acionado
    const voltarParaHome = () => {
        navigation.goBack();
    };

    return {
        contador,
        acionando,
        acionado,
        temLocalizacao: localizacao !== null,
        cancelar,
        voltarParaHome,
    };
}