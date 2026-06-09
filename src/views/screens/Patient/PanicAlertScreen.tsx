import React from 'react';
import {
    ActivityIndicator,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';
import type { PanicEvent } from '@services/panicService';


interface PanicAlertParams {
    nomePaciente: string;
    evento: PanicEvent;
    telefone?: string | null; 
}

const ORIGEM_LABEL: Record<string, string> = {
    MANUAL: 'acionou o botão de pânico',
    SENSOR_GAS: 'teve um alerta de gás/fumaça',
    QUEDA_WATCH: 'teve uma queda detectada',
    BPM_ALTO: 'teve um alerta cardíaco',
    IOT_DEVICE: 'teve um alerta de dispositivo',
    HEALTH_MONITOR: 'teve um alerta de saúde',
    TIMEOUT: 'não respondeu a um alerta',
};

export default function PanicAlertScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { nomePaciente, evento, telefone } = route.params as PanicAlertParams;

    const temLocalizacao =
        evento?.latitude != null &&
        evento?.longitude != null &&
        !(evento.latitude === 0 && evento.longitude === 0); // 0,0 = sem GPS real

    const formatarQuando = (ts: string): string => {
        const data = new Date(ts);
        const agora = Date.now();
        const diffMin = Math.floor((agora - data.getTime()) / 60000);
        if (diffMin < 1) return 'agora mesmo';
        if (diffMin < 60) return `há ${diffMin} min`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `há ${diffH}h`;
        return data.toLocaleString('pt-BR');
    };

    const abrirMapa = () => {
        if (!temLocalizacao) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${evento.latitude},${evento.longitude}`;
        Linking.openURL(url).catch(() => {});
    };

    const ligar = () => {
        if (!telefone) return;
        Linking.openURL(`tel:${telefone}`).catch(() => {});
    };

    return (
        <View style={styles.container}>
            {/* CABEÇALHO VERMELHO */}
            <View style={styles.header}>
                <View style={styles.sirenCircle}>
                    <Icon name="siren" size={48} color="#fff" strokeWidth={2.5} />
                </View>
                <Text style={styles.emergencia}>EMERGÊNCIA</Text>
                <Text style={styles.nome}>
                    {nomePaciente} {ORIGEM_LABEL[evento?.origem] ?? 'precisa de ajuda'}
                </Text>
                {evento?.timestamp && (
                    <Text style={styles.quando}>{formatarQuando(evento.timestamp)}</Text>
                )}
            </View>

            {/* AÇÕES */}
            <View style={styles.actions}>
                {temLocalizacao ? (
                    <TouchableOpacity style={styles.btnPrimary} onPress={abrirMapa}>
                        <Icon name="location" size={24} color="#c83333" />
                        <Text style={styles.btnPrimaryText}>VER NO MAPA</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.semLocal}>
                        <Icon name="location" size={20} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.semLocalText}>
                            Localização não disponível para este alerta.
                        </Text>
                    </View>
                )}

                {telefone ? (
                    <TouchableOpacity style={styles.btnSecondary} onPress={ligar}>
                        <Icon name="bell" size={22} color="#fff" />
                        <Text style={styles.btnSecondaryText}>LIGAR AGORA</Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.goBack()}>
                    <Text style={styles.btnGhostText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7a1f1f', 
        justifyContent: 'space-between',
        paddingVertical: 80,
        paddingHorizontal: SPACING.xl,
    },
    header: { alignItems: 'center', gap: SPACING.md },
    sirenCircle: {
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: '#c83333', alignItems: 'center', justifyContent: 'center',
        borderWidth: 4, borderColor: 'rgba(255,180,180,0.6)',
        marginBottom: SPACING.md,
    },
    emergencia: {
        fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 2,
    },
    nome: {
        fontSize: FONT_SIZES.xl, color: '#fff', textAlign: 'center',
        lineHeight: 28, paddingHorizontal: SPACING.md,
    },
    quando: { fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.8)' },
    actions: { gap: SPACING.md },
    btnPrimary: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
        backgroundColor: '#fff', paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.lg,
    },
    btnPrimaryText: { color: '#c83333', fontSize: FONT_SIZES.lg, fontWeight: '900', letterSpacing: 1 },
    btnSecondary: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
    },
    btnSecondaryText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.bold as any, letterSpacing: 1 },
    semLocal: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
        paddingVertical: SPACING.md,
    },
    semLocalText: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZES.sm },
    btnGhost: { alignItems: 'center', paddingVertical: SPACING.md },
    btnGhostText: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZES.md },
});
