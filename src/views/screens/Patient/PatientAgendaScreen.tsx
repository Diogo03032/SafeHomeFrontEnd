import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePatientAgendaVM } from '@viewmodels/usePatientAgendaVM';
import { EVENT_TYPE_LABELS } from '@services/agendaService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import AgendaCalendar from '@components/domain/AgendaCalendar';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function PatientAgendaScreen() {
    const vm = usePatientAgendaVM();
    const navigation = useNavigation<any>();

    const formatarHora = (hora?: string) => (hora ? hora.slice(0, 5) : '');

    const formatarData = (dataISO: string) => {
        const d = new Date(dataISO + 'T12:00:00');
        return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Icon name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Agenda</Text>
                        <Text style={styles.subtitle}>{vm.nomePaciente}</Text>
                    </View>
                </View>

                {/* AVISO DE SÓ LEITURA (MODERADO) */}
                {!vm.podeEditar && (
                    <View style={styles.readonlyBanner}>
                        <Icon name="eye" size={16} color="#d4a647" />
                        <Text style={styles.readonlyText}>
                            Visualização — você não pode alterar a rotina deste paciente.
                        </Text>
                    </View>
                )}

                <Text style={styles.dataLabel}>{formatarData(vm.dataSelecionada)}</Text>

                {/* CALENDÁRIO */}
                <AgendaCalendar
                    dataSelecionada={vm.dataSelecionada}
                    diasComEvento={vm.diasComEvento}
                    onDiaSelecionado={vm.mudarData}
                    onMudarMes={() => vm.carregarMarcacoesDoMes()}
                />

                {/* PROGRESSO */}
                {vm.totalOcorrencias > 0 && (
                    <Text style={styles.progresso}>
                        {vm.totalConcluidas}/{vm.totalOcorrencias} concluídos
                    </Text>
                )}

                {/* OCORRÊNCIAS */}
                {vm.carregando ? (
                    <ActivityIndicator color="#fff" style={{ marginVertical: 32 }} />
                ) : vm.erro ? (
                    <GlassCard tint="dark" intensity={60}>
                        <Text style={styles.erroText}>{vm.erro}</Text>
                    </GlassCard>
                ) : vm.ocorrencias.length === 0 ? (
                    <GlassCard tint="dark" intensity={60}>
                        <View style={styles.vazioCard}>
                            <Icon name="calendar" size={32} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.vazioText}>
                                Nenhum compromisso neste dia.
                            </Text>
                        </View>
                    </GlassCard>
                ) : (
                    vm.ocorrencias.map((oc) => (
                        <GlassCard
                            key={oc.id_ocorrencia}
                            tint="dark"
                            intensity={60}
                            padding="md"
                            style={{ marginBottom: SPACING.sm, opacity: oc.status_concluido ? 0.6 : 1 }}
                        >
                            <TouchableOpacity
                                onPress={() => vm.alternarConcluido(oc)}
                                style={styles.ocRow}
                                disabled={!vm.podeEditar}
                                activeOpacity={vm.podeEditar ? 0.6 : 1}
                            >
                                <View style={[
                                    styles.checkbox,
                                    oc.status_concluido && styles.checkboxActive,
                                    !vm.podeEditar && styles.checkboxReadonly,
                                ]}>
                                    {oc.status_concluido && (
                                        <Icon name="check" size={16} color="#fff" strokeWidth={3} />
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[
                                        styles.ocTitulo,
                                        oc.status_concluido && { textDecorationLine: 'line-through' },
                                    ]}>
                                        {oc.titulo ?? 'Compromisso'}
                                    </Text>
                                    <Text style={styles.ocHora}>
                                        {formatarHora(oc.data_hora)}
                                        {oc.tipo ? ` · ${EVENT_TYPE_LABELS[oc.tipo]}` : ''}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </GlassCard>
                    ))
                )}

                {/* BOTÃO CRIAR EVENTO — só TOTAL */}
                {vm.podeEditar && (
                    <TouchableOpacity
                        style={styles.criarBtn}
                        onPress={() =>
                            navigation.navigate('CreateEvent', { idPaciente: vm.idPaciente })
                        }
                    >
                        <Icon name="plus" size={20} color="#fff" strokeWidth={2.5} />
                        <Text style={styles.criarBtnText}>Criar evento</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: SPACING.lg, paddingTop: 60, paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: -SPACING.sm },
    title: { fontSize: FONT_SIZES.xxl, fontWeight: FONT_WEIGHTS.bold as any, color: '#fff' },
    subtitle: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)' },
    readonlyBanner: {
        flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
        backgroundColor: 'rgba(212,166,71,0.15)', borderColor: 'rgba(212,166,71,0.4)',
        borderWidth: 1, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.md,
    },
    readonlyText: { fontSize: FONT_SIZES.xs, color: '#e6c478', flex: 1 },
    dataLabel: {
        fontSize: FONT_SIZES.md, color: 'rgba(255,255,255,0.85)',
        textTransform: 'capitalize', marginBottom: SPACING.sm,
    },
    progresso: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', marginBottom: SPACING.sm },
    erroText: { color: '#ffb478', fontSize: FONT_SIZES.sm, textAlign: 'center' },
    vazioCard: { alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
    vazioText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
    ocRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    checkbox: {
        width: 28, height: 28, borderRadius: BORDER_RADIUS.sm, borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
    },
    checkboxActive: { backgroundColor: '#1d9e75', borderColor: '#1d9e75' },
    checkboxReadonly: { borderColor: 'rgba(255,255,255,0.2)' },
    ocTitulo: { fontSize: FONT_SIZES.md, color: '#fff', fontWeight: FONT_WEIGHTS.semibold as any },
    ocHora: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
    criarBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
        marginTop: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md,
        backgroundColor: '#1d9e75',
    },
    criarBtnText: { color: '#fff', fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.bold as any },
});
