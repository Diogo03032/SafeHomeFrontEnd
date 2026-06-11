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


    const intervalRef = useRef<any>(null);;

 
    const capturarLocalizacao = async (): Promise<{ lat: number; lng: number } | null> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.warn('[usePanicVM] Sem permissão de localização');
                return null;
            }
 
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
 
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setLocalizacao(coords);
            return coords;
        } catch (error) {
            console.warn('[usePanicVM] Erro ao pegar localização:', error);
            return null;
        }
    };

    
    useEffect(() => {
       
        capturarLocalizacao();
       
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

        intervalRef.current = setInterval(() => {
            setContador((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    acionarAgora();
                    return 0;
                }
              
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

  
   const acionarAgora = async () => {
        setAcionando(true);
 
        try {
            
            let coords = localizacao;
            if (!coords) {
                coords = await capturarLocalizacao();
            }
 
            await panicService.triggerPanic({
                latitude: coords?.lat ?? 0,
                longitude: coords?.lng ?? 0,
                origem: 'MANUAL',
            });
 
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

    
    const cancelar = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

   
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
