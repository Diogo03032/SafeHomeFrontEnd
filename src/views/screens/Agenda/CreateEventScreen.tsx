import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCreateEventVM } from '@viewmodels/useCreateEventVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

export default function CreateEventScreen() {
    const vm = useCreateEventVM();

    return (
        <ScreenContainer variant="app" safeArea={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={vm.cancelar} style={styles.backBtn}>
                            <Icon name="arrow-left" size={26} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Novo evento</Text>
                    </View>

                    <Text style={styles.subtitle}>
                        Crie um compromisso recorrente. Ele vai aparecer na sua agenda
                        todos os dias entre a data de início e fim.
                    </Text>

                    {/* DADOS DO EVENTO */}
                    <GlassCard tint="dark" intensity={60}>
                        <Input
                            label="Título"
                            placeholder="Ex: Remédio da manhã"
                            value={vm.titulo}
                            onChangeText={vm.setTitulo}
                            error={vm.erros.titulo}
                            editable={!vm.salvando}
                        />

                        {/* SELETOR DE TIPO — BOTÕES */}
                        <Text style={styles.label}>Tipo</Text>
                        <View style={styles.tipoGrid}>
                            {vm.opcoesTipo.map((opcao) => {
                                const selecionado = vm.tipo === opcao.value;
                                return (
                                    <TouchableOpacity
                                        key={opcao.value}
                                        onPress={() => vm.setTipo(opcao.value)}
                                        style={[
                                            styles.tipoOpcao,
                                            selecionado && styles.tipoOpcaoSelected,
                                        ]}
                                        disabled={vm.salvando}
                                        accessibilityRole="radio"
                                        accessibilityState={{ selected: selecionado }}
                                    >
                                        <Text style={[
                                            styles.tipoTexto,
                                            { color: selecionado ? '#fff' : 'rgba(255,255,255,0.75)' },
                                        ]}>
                                            {opcao.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Input
                            label="Horário (HH:mm)"
                            placeholder="08:30"
                            value={vm.hora}
                            onChangeText={vm.setHora}
                            keyboardType="numbers-and-punctuation"
                            error={vm.erros.hora}
                            editable={!vm.salvando}
                        />

                        <Input
                            label="Descrição (opcional)"
                            placeholder="Detalhes do compromisso"
                            value={vm.descricao}
                            onChangeText={vm.setDescricao}
                            multiline
                            maxLength={300}
                            editable={!vm.salvando}
                        />
                    </GlassCard>

                    {/* PERÍODO */}
                    <Text style={styles.sectionLabel}>PERÍODO</Text>
                    <GlassCard tint="dark" intensity={60}>
                        <Input
                            label="Data de início (AAAA-MM-DD)"
                            placeholder="2026-06-05"
                            value={vm.dataInicio}
                            onChangeText={vm.setDataInicio}
                            keyboardType="numbers-and-punctuation"
                            error={vm.erros.dataInicio}
                            editable={!vm.salvando}
                        />

                        <Input
                            label="Data de fim (opcional)"
                            placeholder="Deixe vazio pra repetir por 90 dias"
                            value={vm.dataFim}
                            onChangeText={vm.setDataFim}
                            keyboardType="numbers-and-punctuation"
                            error={vm.erros.dataFim}
                            editable={!vm.salvando}
                        />

                        <View style={styles.dicaRow}>
                            <Icon name="info" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.dicaText}>
                                Sem data de fim, o evento se repete por 90 dias.
                            </Text>
                        </View>
                    </GlassCard>

                    {/* AÇÕES */}
                    <View style={styles.btnRow}>
                        <Button
                            title="Cancelar"
                            variant="ghost"
                            onPress={vm.cancelar}
                            style={{ flex: 1 }}
                        />
                        <Button
                            title="Criar evento"
                            onPress={vm.salvar}
                            loading={vm.salvando}
                            disabled={!vm.titulo.trim() || !vm.hora.trim()}
                            style={{ flex: 1, marginLeft: SPACING.sm }}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: SPACING.xl,
        paddingTop: 60,
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: FONT_WEIGHTS.medium as any,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    sectionLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
    },
    tipoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    tipoOpcao: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.pill,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    tipoOpcaoSelected: {
        backgroundColor: '#1d9e75',
        borderColor: '#1d9e75',
    },
    tipoTexto: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    dicaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginTop: SPACING.sm,
    },
    dicaText: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.7)',
        flex: 1,
    },
    btnRow: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
    },
});
