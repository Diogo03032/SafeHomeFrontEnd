import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAgendaVM } from '@viewmodels/useAgendaVM';
import { EVENT_TYPE_LABELS } from '@services/agendaService';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Button from '@components/ui/Button';
import AgendaCalendar from '@components/domain/AgendaCalendar';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';
import { useNavigation } from '@react-navigation/native';

export default function AgendaScreen() {
    const vm = useAgendaVM();
    const navigation = useNavigation<any>();

    const formatarDataExibicao = (dataISO: string): string => {
        const data = new Date(dataISO + 'T12:00:00');
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const formatarHora = (hora?: string): string => {
        if (!hora) return '';
        return hora.slice(0, 5);
    };

    const notasProprias = vm.notas.filter((n) => n.id_autor === vm.user?.id_usuario);
    const notasContatos = vm.notas.filter((n) => n.id_autor !== vm.user?.id_usuario);

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => vm.carregarDados(true)}
                        tintColor="#fff"
                    />
                }
            >
                {/* HEADER */}
                <View style={styles.headerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>Agenda</Text>
                            <Text style={styles.subtitle}>
                            {formatarDataExibicao(vm.dataSelecionada)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreateEvent')}
                        style={styles.addBtn}
                        accessibilityLabel="Criar evento"
                        accessibilityRole="button"
                    >
                        <Icon name="plus" size={26} color="#fff" strokeWidth={2.5} />
                    </TouchableOpacity>
               </View>

                {/* CALENDÁRIO */}
                <AgendaCalendar
                    dataSelecionada={vm.dataSelecionada}
                    diasComEvento={vm.diasComEvento}
                    onDiaSelecionado={vm.mudarData}
                    onMudarMes={() => vm.carregarMarcacoesDoMes()}
                />

                {/* CARD DE PROGRESSO */}
                {vm.totalOcorrencias > 0 && (
                    <GlassCard tint="dark" intensity={60} style={{ marginBottom: SPACING.md }}>
                        <Text style={styles.progressLabel}>Progresso do dia</Text>
                        <Text style={styles.progressValue}>
                            {vm.totalConcluidas}/{vm.totalOcorrencias} concluídas
                        </Text>
                        <View style={styles.progressBarBg}>
                            <View style={[
                                styles.progressBarFill,
                                { width: `${vm.percentualConcluido}%` },
                            ]} />
                        </View>
                    </GlassCard>
                )}

                {/* OCORRÊNCIAS */}
                <Text style={styles.sectionTitle}>Compromissos</Text>

                {vm.carregando ? (
                    <ActivityIndicator color="#fff" style={{ marginVertical: SPACING.lg }} />
                ) : vm.ocorrencias.length === 0 ? (
                    <GlassCard tint="dark" intensity={60}>
                        <View style={styles.emptyCard}>
                            <Icon name="heart" size={32} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.emptyText}>
                                {'Nenhum compromisso pra hoje.\nAproveite seu dia!'}
                            </Text>
                        </View>
                    </GlassCard>
                ) : (
                vm.ocorrencias.map((oc) => (
                        <GlassCard
                            key={oc.id_ocorrencia}
                            tint="dark"
                            intensity={60}
                            style={{ ...styles.ocorrenciaCard, opacity: oc.status_concluido ? 0.6 : 1 }}
                            padding="md"
                        >
                            <View style={styles.ocorrenciaRow}>
                                    <TouchableOpacity
                                        onPress={() => vm.alternarConcluido(oc)}
                                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.md }}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{ checked: oc.status_concluido }}
                                    >
                                        <View style={[
                                            styles.checkbox,
                                            oc.status_concluido && styles.checkboxActive,
                                        ]}>
                                            {oc.status_concluido ? (
                                                <Icon name="check" size={16} color="#fff" strokeWidth={3} />
                                        ) : null}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={[
                                            styles.ocorrenciaTitulo,
                                            oc.status_concluido && { textDecorationLine: 'line-through' },
                                        ]}>
                                            {oc.titulo ?? 'Compromisso'}
                                        </Text>
                                        <Text style={styles.ocorrenciaHora}>
                                            {`${formatarHora(oc.data_hora)}${oc.tipo ? ` · ${EVENT_TYPE_LABELS[oc.tipo]}` : ''}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => vm.excluirEvento(oc)}
                                    style={{ padding: SPACING.sm }}
                                    accessibilityLabel="Excluir evento"
                                >
                                    <Icon name="trash" size={20} color="rgba(255,255,255,0.6)" />
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    ))
                )}

                {/* NOTAS PRÓPRIAS */}
                <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                    Suas notas deste mês
                </Text>
                
                {notasProprias.length === 0 ? (
                    <Text style={styles.notaVazia}>
                        Você ainda não escreveu nenhuma nota neste mês.
                    </Text>
                ) : (
                    notasProprias.map((nota) => (
                          <GlassCard
                              key={nota.id_nota}
                              tint="dark"
                              intensity={60}
                              padding="md"
                              style={{ marginBottom: SPACING.sm }}
                            >
                              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                  <View style={{ flex: 1 }}>
                                      <Text style={styles.notaTexto}>{nota.texto}</Text>
                                      <Text style={styles.notaData}>
                                          {new Date(nota.data_criacao).toLocaleDateString('pt-BR')}
                                      </Text>
                                  </View>
                                  <TouchableOpacity
                                      onPress={() => vm.excluirNota(nota)}
                                      style={{ padding: SPACING.xs }}
                                      accessibilityLabel="Excluir nota"
                                    >
                                      <Icon name="trash" size={18} color="rgba(255,255,255,0.5)" />
                                  </TouchableOpacity>
                              </View>
                          </GlassCard>
                      ))
                )}
                                                                                             
                {/* ADICIONAR NOTA */}
                <GlassCard tint="dark" intensity={60} padding="md">
                    <TextInput
                        style={styles.notaInput}
                        placeholder="Como você está se sentindo este mês?"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={vm.novaNota}
                        onChangeText={vm.setNovaNota}
                        multiline
                        maxLength={500}
                    />
                    <View style={styles.notaActions}>
                        <Text style={styles.notaCounter}>{vm.novaNota.length}/500</Text>
                        <Button
                            title="Salvar"
                            onPress={vm.adicionarNota}
                            loading={vm.salvandoNota}
                            disabled={!vm.novaNota.trim()}
                            style={styles.notaSaveBtn}
                        />
                    </View>
                </GlassCard>
                
                {/* NOTAS DE CONTATOS */}
                {notasContatos.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>
                            Notas dos seus contatos
                        </Text>
                        {notasContatos.map((nota) => (
                            <GlassCard
                                key={nota.id_nota}
                                tint="dark"
                                intensity={60}
                                padding="md"
                                style={{
                                    marginBottom: SPACING.sm,
                                    borderColor: 'rgba(92,217,158,0.3)',
                                }}
                            >
                                <View style={styles.notaAutorRow}>
                                    <Icon name="heart" size={14} color="#5cd99e" />
                                    <Text style={styles.notaAutor}>
                                        {nota.autor_nome ?? 'Um contato'}
                                    </Text>
                                </View>
                                <Text style={styles.notaTexto}>{nota.texto}</Text>
                            </GlassCard>
                        ))}
                    </>
                )} 
                
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 100,
        paddingBottom: 100,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.85)',
        marginBottom: SPACING.lg,
        textTransform: 'capitalize',
    },
    progressLabel: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
    },
    progressValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
        marginTop: 2,
        marginBottom: SPACING.sm,
    },
    progressBarBg: {
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#5cd99e',
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
        marginBottom: SPACING.sm,
    },
    emptyCard: {
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 22,
    },
    ocorrenciaCard: {
        marginBottom: SPACING.sm,
    },
    ocorrenciaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    ocorrenciaTitulo: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
    },
    ocorrenciaHora: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    notaVazia: {
        fontSize: FONT_SIZES.sm,
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: SPACING.sm,
    },
    notaTexto: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        lineHeight: 22,
    },
    notaData: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        marginTop: SPACING.xs,
        textAlign: 'right',
    },
    notaAutorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    notaAutor: {
        fontSize: FONT_SIZES.sm,
        color: '#5cd99e',
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    notaInput: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    notaActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    notaCounter: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
    },
    notaSaveBtn: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        minHeight: 36,
    },
    headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    },
    addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(29,158,117,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    }
});
