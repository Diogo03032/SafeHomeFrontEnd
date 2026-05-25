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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAgendaVM } from '@viewmodels/useAgendaVM';
import Button from '@components/ui/Button';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function AgendaScreen() {
    const vm = useAgendaVM();
    const colors = getThemeColors('forest');

    // Gera os 7 próximos dias pra mostrar no seletor
    const gerarUltimos7Dias = () => {
        const dias = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dias.push(d.toISOString().split('T')[0]);
        }
        return dias;
    };

    const dias = gerarUltimos7Dias();

    const formatarDataExibicao = (dataISO: string): string => {
        const data = new Date(dataISO + 'T12:00:00');
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const formatarDiaNumero = (dataISO: string): string => {
        return dataISO.split('-')[2];
    };

    const formatarDiaSemana = (dataISO: string): string => {
        const data = new Date(dataISO + 'T12:00:00');
        return data.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
    };

    // Separa notas próprias das notas dos contatos
    const notasProprias = vm.notas.filter((n) => n.id_autor === vm.user?.id_usuario);
    const notasContatos = vm.notas.filter((n) => n.id_autor !== vm.user?.id_usuario);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={vm.atualizando}
                        onRefresh={() => vm.carregarDados(true)}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* HEADER */}
                <Text style={[styles.title, { color: colors.primaryDark }]}>Agenda</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {formatarDataExibicao(vm.dataSelecionada)}
                </Text>

                {/* SELETOR DE DIA */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysScroll}
                >
                    {dias.map((dia) => {
                        const selecionado = dia === vm.dataSelecionada;
                        return (
                            <TouchableOpacity
                                key={dia}
                                onPress={() => vm.mudarData(dia)}
                                style={[
                                    styles.diaButton,
                                    {
                                        backgroundColor: selecionado ? colors.primary : colors.surface,
                                        borderColor: selecionado ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <Text style={[
                                    styles.diaSemana,
                                    { color: selecionado ? colors.textOnPrimary : colors.textSecondary },
                                ]}>
                                    {formatarDiaSemana(dia)}
                                </Text>
                                <Text style={[
                                    styles.diaNumero,
                                    { color: selecionado ? colors.textOnPrimary : colors.textPrimary },
                                ]}>
                                    {formatarDiaNumero(dia)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* CARD DE PROGRESSO */}
                {vm.totalOcorrencias > 0 && (
                    <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.progressInfo}>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                                Progresso do dia
                            </Text>
                            <Text style={[styles.progressValue, { color: colors.primaryDark }]}>
                                {vm.totalConcluidas}/{vm.totalOcorrencias} concluídas
                            </Text>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: colors.borderSubtle }]}>
                            <View style={[
                                styles.progressBarFill,
                                {
                                    width: `${vm.percentualConcluido}%`,
                                    backgroundColor: colors.primary,
                                },
                            ]} />
                        </View>
                    </View>
                )}

                {/* OCORRÊNCIAS */}
                <Text style={[styles.sectionTitle, { color: colors.primaryDark }]}>
                    Compromissos
                </Text>

                {vm.carregando ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: SPACING.lg }} />
                ) : vm.ocorrencias.length === 0 ? (
                    <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                        <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: SPACING.sm }}>
                            🌱
                        </Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Nenhum compromisso pra hoje.{'\n'}Aproveite seu dia!
                        </Text>
                    </View>
                ) : (
                    vm.ocorrencias.map((oc) => (
                        <TouchableOpacity
                            key={oc.id_ocorrencia}
                            onPress={() => vm.alternarConcluido(oc)}
                            style={[
                                styles.ocorrenciaCard,
                                {
                                    backgroundColor: colors.surface,
                                    opacity: oc.status_concluido ? 0.55 : 1,
                                },
                            ]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: oc.status_concluido }}
                            accessibilityLabel={`${oc.titulo} às ${oc.hora}`}
                        >
                            {/* Checkbox */}
                            <View style={[
                                styles.checkbox,
                                {
                                    backgroundColor: oc.status_concluido ? colors.primary : 'transparent',
                                    borderColor: oc.status_concluido ? colors.primary : colors.border,
                                },
                            ]}>
                                {oc.status_concluido && (
                                    <Text style={{ color: '#fff', fontWeight: '900' }}>✓</Text>
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={[
                                    styles.ocorrenciaTitulo,
                                    {
                                        color: colors.textPrimary,
                                        textDecorationLine: oc.status_concluido ? 'line-through' : 'none',
                                    },
                                ]}>
                                    {oc.titulo}
                                </Text>
                                <Text style={[styles.ocorrenciaHora, { color: colors.textSecondary }]}>
                                    {oc.hora} · {oc.categoria}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {/* NOTAS PRÓPRIAS */}
                <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginTop: SPACING.xl }]}>
                    Suas notas deste mês
                </Text>

                {notasProprias.length === 0 ? (
                    <Text style={[styles.notaVazia, { color: colors.textSecondary }]}>
                        Você ainda não escreveu nenhuma nota neste mês.
                    </Text>
                ) : (
                    notasProprias.map((nota) => (
                        <View key={nota.id_nota} style={[styles.notaCard, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.notaTexto, { color: colors.textPrimary }]}>
                                {nota.texto}
                            </Text>
                            <Text style={[styles.notaData, { color: colors.textSecondary }]}>
                                {new Date(nota.data_criacao).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                    ))
                )}

                {/* ADICIONAR NOTA */}
                <View style={[styles.notaInputContainer, { backgroundColor: colors.surface }]}>
                    <TextInput
                        style={[styles.notaInput, { color: colors.textPrimary }]}
                        placeholder="Como você está se sentindo este mês?"
                        placeholderTextColor={colors.textSecondary}
                        value={vm.novaNota}
                        onChangeText={vm.setNovaNota}
                        multiline
                        maxLength={500}
                    />
                    <View style={styles.notaActions}>
                        <Text style={[styles.notaCounter, { color: colors.textSecondary }]}>
                            {vm.novaNota.length}/500
                        </Text>
                        <Button
                            title="Salvar nota"
                            onPress={vm.adicionarNota}
                            loading={vm.salvandoNota}
                            disabled={!vm.novaNota.trim()}
                            style={{ paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, minHeight: 36 }}
                        />
                    </View>
                </View>

                {/* NOTAS DE CONTATOS */}
                {notasContatos.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginTop: SPACING.xl }]}>
                            Notas dos seus contatos
                        </Text>
                        {notasContatos.map((nota) => (
                            <View
                                key={nota.id_nota}
                                style={[
                                    styles.notaCard,
                                    { backgroundColor: colors.surfaceTinted },
                                ]}
                            >
                                <Text style={[styles.notaAutor, { color: colors.primary }]}>
                                    💚 {nota.autor_nome ?? 'Um contato'}
                                </Text>
                                <Text style={[styles.notaTexto, { color: colors.textPrimary }]}>
                                    {nota.texto}
                                </Text>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: SPACING.xl, paddingBottom: SPACING.xxl },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        marginBottom: SPACING.lg,
        textTransform: 'capitalize',
    },
    daysScroll: {
        gap: SPACING.sm,
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.md,
    },
    diaButton: {
        width: 60,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    diaSemana: { fontSize: FONT_SIZES.xs, textTransform: 'uppercase' },
    diaNumero: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold as any,
        marginTop: 2,
    },
    progressCard: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    progressInfo: { marginBottom: SPACING.sm },
    progressLabel: { fontSize: FONT_SIZES.sm },
    progressValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold as any,
        marginTop: 2,
    },
    progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold as any,
        marginBottom: SPACING.sm,
    },
    emptyCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
    },
    emptyText: { fontSize: FONT_SIZES.md, textAlign: 'center', lineHeight: 22 },
    ocorrenciaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.sm,
        gap: SPACING.md,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ocorrenciaTitulo: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
    },
    ocorrenciaHora: {
        fontSize: FONT_SIZES.sm,
        marginTop: 2,
    },
    notaVazia: {
        fontSize: FONT_SIZES.sm,
        fontStyle: 'italic',
        marginBottom: SPACING.sm,
    },
    notaCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.sm,
    },
    notaAutor: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold as any,
        marginBottom: SPACING.xs,
    },
    notaTexto: {
        fontSize: FONT_SIZES.md,
        lineHeight: 22,
    },
    notaData: {
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.xs,
        textAlign: 'right',
    },
    notaInputContainer: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.sm,
    },
    notaInput: {
        fontSize: FONT_SIZES.md,
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
    },
});
