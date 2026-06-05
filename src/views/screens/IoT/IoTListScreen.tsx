import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useIotVM } from '@viewmodels/useIotVM';
import type { IoTDevice, DeviceType } from '@services/iotService';
import { DEVICE_LABELS } from '@services/iotService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon, IconName } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

// Mapa de tipo de dispositivo → ícone lucide
const DEVICE_ICONS: Record<DeviceType, IconName> = {
    GAS_SENSOR: 'flame',
    DOOR_SENSOR: 'door-open',
    MOTION_SENSOR: 'radio',
    SMART_LIGHT: 'lightbulb',
    NOISE_SENSOR: 'volume',
    PANIC_BUTTON: 'siren',
    OTHER: 'plug',
};

export default function IoTListScreen() {
    const vm = useIotVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => vm.carregar(true)}
                        tintColor="#fff"
                    />
                }
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>Meus Dispositivos</Text>
                    <Text style={styles.subtitle}>
                        {vm.totalAtivos} ativos · {vm.totalInativos} inativos
                    </Text>
                </View>

                {/* CARD DE STATUS GERAL */}
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <View style={styles.statusRow}>
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: vm.totalAtivos > 0 ? '#5cd99e' : 'rgba(255,255,255,0.4)' },
                        ]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.statusTitle}>
                                {vm.totalAtivos > 0 ? 'Sua casa está protegida' : 'Nenhum dispositivo ativo'}
                            </Text>
                            <Text style={styles.statusSub}>Última atualização agora</Text>
                        </View>
                    </View>
                </GlassCard>

                {vm.carregando ? (
                    <ActivityIndicator color="#fff" style={{ marginVertical: 32 }} />
                ) : vm.erro ? (
                    <GlassCard tint="dark" intensity={60}>
                        <Text style={styles.erroText}>{vm.erro}</Text>
                        <TouchableOpacity onPress={() => vm.carregar()} style={styles.retryBtn}>
                            <Text style={styles.retryText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </GlassCard>
                ) : vm.dispositivos.length === 0 ? (
                    <GlassCard tint="dark" intensity={60}>
                        <View style={styles.emptyCard}>
                            <Icon name="plug" size={40} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.emptyTitle}>Sem dispositivos ainda</Text>
                            <Text style={styles.emptyText}>
                                Adicione sensores e câmeras pra monitorar sua casa.
                            </Text>
                        </View>
                    </GlassCard>
                ) : (
                    <>
                        {vm.grupos.seguranca.length > 0 && (
                            <>
                                <Text style={styles.secao}>SEGURANÇA</Text>
                                {vm.grupos.seguranca.map((d) => (
                                    <DispositivoItem key={d.id_dispositivo} dispositivo={d} onToggle={() => vm.alternarStatus(d)} />
                                ))}
                            </>
                        )}

                        {vm.grupos.ambiente.length > 0 && (
                            <>
                                <Text style={styles.secao}>AMBIENTE</Text>
                                {vm.grupos.ambiente.map((d) => (
                                    <DispositivoItem key={d.id_dispositivo} dispositivo={d} onToggle={() => vm.alternarStatus(d)} />
                                ))}
                            </>
                        )}

                        {vm.grupos.outros.length > 0 && (
                            <>
                                <Text style={styles.secao}>OUTROS</Text>
                                {vm.grupos.outros.map((d) => (
                                    <DispositivoItem key={d.id_dispositivo} dispositivo={d} onToggle={() => vm.alternarStatus(d)} />
                                ))}
                            </>
                        )}
                    </>
                )}

                {/* BOTÃO ADICIONAR (placeholder) */}
                <TouchableOpacity
                    onPress={() => alert('Funcionalidade em desenvolvimento')}
                    style={styles.addBtn}
                >
                    <Icon name="plus" size={20} color="#fff" />
                    <Text style={styles.addText}>Adicionar dispositivo</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
}

function DispositivoItem({
    dispositivo,
    onToggle,
}: {
    dispositivo: IoTDevice;
    onToggle: () => void;
}) {
    return (
        <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.sm }}>
            <View style={styles.dispRow}>
                <View style={styles.dispIcon}>
                    <Icon name={DEVICE_ICONS[dispositivo.tipo]} size={22} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.dispNome}>{dispositivo.nome}</Text>
                    <Text style={styles.dispLocal}>
                        {dispositivo.local} · {DEVICE_LABELS[dispositivo.tipo]}
                    </Text>
                </View>

                <Switch
                    value={dispositivo.status_ativo}
                    onValueChange={onToggle}
                    trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#1d9e75' }}
                    thumbColor="#fff"
                />
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: 100,
        paddingBottom: 100,
    },
    header: { marginBottom: SPACING.lg },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    statusDot: { width: 12, height: 12, borderRadius: 6 },
    statusTitle: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    statusSub: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    secao: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 0.5,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    dispRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    dispIcon: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dispNome: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    dispLocal: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        marginTop: SPACING.lg,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: BORDER_RADIUS.md,
        borderStyle: 'dashed',
    },
    addText: { color: '#fff', fontSize: FONT_SIZES.sm },
    emptyCard: { alignItems: 'center', paddingVertical: SPACING.md },
    emptyTitle: {
        fontSize: FONT_SIZES.lg,
        color: '#fff',
        fontWeight: FONT_WEIGHTS.bold as any,
        marginTop: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: SPACING.xs,
    },
    erroText: {
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    retryBtn: { alignSelf: 'center', padding: SPACING.sm },
    retryText: {
        color: '#5cd99e',
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
});
