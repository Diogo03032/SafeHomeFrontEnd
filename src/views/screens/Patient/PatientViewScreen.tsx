import React, { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePatientViewVM } from '@viewmodels/usePatientViewVM';
import { CATEGORY_LABELS } from '@services/iotService';
import type { IoTDevice } from '@services/iotService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function PatientViewScreen() {
    const vm = usePatientViewVM();
    const navigation = useNavigation<any>();
    const [aba, setAba] = useState<'painel' | 'agenda'>('painel');

    const iniciais = vm.nomePaciente.charAt(0).toUpperCase();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.patientHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{iniciais}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nome}>{vm.nomePaciente}</Text>
                        <View style={styles.nivelBadge}>
                            <Icon name="shield" size={12} color="#5cd99e" />
                            <Text style={styles.nivelText}>{vm.labelNivel()}</Text>
                        </View>
                    </View>
                </View>

                {/* SOMENTE_EMERGENCIA não vê painel nem agenda */}
                {!vm.podeVerPainel ? (
                    <GlassCard tint="dark" intensity={60}>
                        <View style={styles.restritoCard}>
                            <Icon name="lock" size={36} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.restritoTitulo}>Acesso de emergência</Text>
                            <Text style={styles.restritoTexto}>
                                Você é contato de emergência de {vm.nomePaciente}. Receberá
                                alertas quando houver uma emergência, mas não tem acesso à
                                rotina diária dele(a).
                            </Text>
                        </View>
                    </GlassCard>
                ) : (
                    <>
                        {/* ABAS */}
                        <View style={styles.tabBar}>
                            <TouchableOpacity
                                style={[styles.tab, aba === 'painel' && styles.tabActive]}
                                onPress={() => setAba('painel')}
                            >
                                <Text style={[styles.tabText, aba === 'painel' && styles.tabTextActive]}>
                                    Painel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, aba === 'agenda' && styles.tabActive]}
                                onPress={() => setAba('agenda')}
                            >
                                <Text style={[styles.tabText, aba === 'agenda' && styles.tabTextActive]}>
                                    Agenda
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {aba === 'painel' ? (
                            <PainelTab vm={vm} navigation={navigation} />
                        ) : (
                            <AgendaTab vm={vm} navigation={navigation} />
                        )}
                    </>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

// ===================== ABA PAINEL =====================
function PainelTab({
    vm,
    navigation,
}: {
    vm: ReturnType<typeof usePatientViewVM>;
    navigation: any;
}) {
    if (vm.carregando) {
        return <ActivityIndicator color="#fff" style={{ marginVertical: 32 }} />;
    }
    if (vm.erro) {
        return (
            <GlassCard tint="dark" intensity={60}>
                <Text style={styles.erroText}>{vm.erro}</Text>
            </GlassCard>
        );
    }

    return (
        <>
            {/* STATUS (card fixo no topo) */}
            {vm.status && (
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.cardLabel}>Status do dia</Text>
                    <View style={styles.statusRow}>
                        <View style={[styles.statusDot, { backgroundColor: vm.corStatus() }]} />
                        <Text style={[styles.statusValue, { color: vm.corStatus() }]}>
                            {vm.status.status}
                        </Text>
                    </View>
                    <Text style={styles.statusDetail}>
                        Consistência da rotina: {vm.status.consistencia_rotina}%
                    </Text>
                    <Text style={styles.statusDetail}>
                        {vm.status.dias_estabilidade} dias de estabilidade
                    </Text>
                </GlassCard>
            )}

            {/* ESTATÍSTICAS */}
            {vm.stats && (
                <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                    <Text style={styles.cardLabel}>Estatísticas da semana</Text>
                    <View style={styles.statGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>
                                {vm.stats.metas_concluidas_semana}/{vm.stats.metas_totais_semana}
                            </Text>
                            <Text style={styles.statHint}>Metas concluídas</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>{vm.stats.consistencia_rotina}%</Text>
                            <Text style={styles.statHint}>Consistência</Text>
                        </View>
                    </View>
                    {vm.stats.mensagem_motivacional ? (
                        <Text style={styles.motivacional}>{vm.stats.mensagem_motivacional}</Text>
                    ) : null}
                </GlassCard>
            )}

            {/* ALERTA DE PÂNICO (só aparece se houver registro) */}
            {vm.ultimoAlerta && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('PanicAlert', {
                        nomePaciente: vm.nomePaciente,
                        evento: vm.ultimoAlerta,
                    })}
                    style={styles.alertaBtn}
                >
                    <Icon name="siren" size={22} color="#fff" />
                    <Text style={styles.alertaBtnText}>Ver último alerta de emergência</Text>
                </TouchableOpacity>
            )}

            {/* DISPOSITIVOS */}
            <Text style={styles.sectionTitle}>Dispositivos</Text>
            {vm.dispositivos.length === 0 ? (
                <GlassCard tint="dark" intensity={60}>
                    <Text style={styles.vazioText}>
                        {vm.nomePaciente} não tem dispositivos cadastrados.
                    </Text>
                </GlassCard>
            ) : (
                vm.dispositivos.map((d) => <DeviceRow key={d.id_dispositivo} device={d} />)
            )}
        </>
    );
}

function DeviceRow({ device }: { device: IoTDevice }) {
    return (
        <GlassCard tint="dark" intensity={60} padding="md" style={{ marginBottom: SPACING.sm }}>
            <View style={styles.deviceRow}>
                <View style={[
                    styles.deviceDot,
                    { backgroundColor: device.status_ativo ? '#5cd99e' : 'rgba(255,255,255,0.3)' },
                ]} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.deviceNome}>{device.nome}</Text>
                    <Text style={styles.deviceCat}>{CATEGORY_LABELS[device.categoria]}</Text>
                </View>
                <Text style={styles.deviceStatus}>
                    {device.status_ativo ? 'Ativo' : 'Inativo'}
                </Text>
            </View>
        </GlassCard>
    );
}

// ===================== ABA AGENDA =====================
function AgendaTab({
    vm,
    navigation,
}: {
    vm: ReturnType<typeof usePatientViewVM>;
    navigation: any;
}) {
    return (
        <GlassCard tint="dark" intensity={60}>
            <View style={styles.agendaPlaceholder}>
                <Icon name="calendar" size={36} color="rgba(255,255,255,0.6)" />
                <Text style={styles.agendaTitulo}>Agenda de {vm.nomePaciente}</Text>
                <Text style={styles.agendaTexto}>
                    {vm.podeEditar
                        ? 'Você tem acesso total: pode ver e gerenciar os compromissos.'
                        : 'Você pode visualizar os compromissos (somente leitura).'}
                </Text>
                <TouchableOpacity
                    style={styles.agendaBtn}
                    onPress={() =>
                        navigation.navigate('PatientAgenda', {
                            idPaciente: vm.idPaciente,
                            nomePaciente: vm.nomePaciente,
                            podeEditar: vm.podeEditar,
                        })
                    }
                >
                    <Text style={styles.agendaBtnText}>ABRIR AGENDA</Text>
                </TouchableOpacity>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.lg, paddingTop: 60, paddingBottom: 100 },
    header: { flexDirection: 'row', marginBottom: SPACING.sm },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -SPACING.sm },
    patientHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
    avatar: {
        width: 56, height: 56, borderRadius: BORDER_RADIUS.pill,
        backgroundColor: '#1d9e75', alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: '#fff', fontSize: FONT_SIZES.xl, fontWeight: '700' },
    nome: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff' },
    nivelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    nivelText: { fontSize: FONT_SIZES.xs, color: '#5cd99e', fontWeight: FONT_WEIGHTS.semibold as any },
    tabBar: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    tab: {
        flex: 1, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    },
    tabActive: { backgroundColor: 'rgba(29,158,117,0.3)', borderWidth: 1, borderColor: 'rgba(92,217,158,0.5)' },
    tabText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)' },
    tabTextActive: { color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    cardLabel: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SPACING.sm },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    statusDot: { width: 12, height: 12, borderRadius: 6 },
    statusValue: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any },
    statusDetail: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    statGrid: { flexDirection: 'row', gap: SPACING.md },
    statItem: { flex: 1 },
    statNum: { fontSize: FONT_SIZES.xl, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff' },
    statHint: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    motivacional: {
        fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.85)',
        marginTop: SPACING.md, fontStyle: 'italic', lineHeight: 20,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg, fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff', marginBottom: SPACING.sm,
    },
    alertaBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: SPACING.sm, backgroundColor: '#c83333', paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md,
    },
    alertaBtnText: { color: '#fff', fontWeight: FONT_WEIGHTS.bold as any },
    deviceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    deviceDot: { width: 10, height: 10, borderRadius: 5 },
    deviceNome: { fontSize: FONT_SIZES.md, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    deviceCat: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    deviceStatus: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)' },
    vazioText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
    erroText: { color: '#ffb478', fontSize: FONT_SIZES.sm, textAlign: 'center' },
    restritoCard: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg },
    restritoTitulo: { fontSize: FONT_SIZES.lg, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    restritoTexto: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 20 },
    agendaPlaceholder: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg },
    agendaTitulo: { fontSize: FONT_SIZES.lg, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    agendaTexto: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 20 },
    agendaBtn: {
        marginTop: SPACING.sm, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md, backgroundColor: '#1d9e75',
    },
    agendaBtnText: { color: '#fff', fontWeight: FONT_WEIGHTS.bold as any, letterSpacing: 0.5 },
});
