import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateEventVM } from '@viewmodels/useCreateEventVM';
import ScreenContainer from '@components/layout/ScreenContainer';
import GlassCard from '@components/ui/GlassCard';
import { Icon } from '@components/ui/Icon';
import Input from '@components/ui/Input';
import Button from '@components/ui/Button';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';


const formatarHora = (d: Date): string => {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
};

const formatarData = (d: Date): string => {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

const parseData = (s: string): Date => {
    if (!s) return new Date();
    const [ano, mes, dia] = s.split('-').map(Number);
    return new Date(ano, mes - 1, dia, 12, 0, 0);
};

const parseHora = (s: string): Date => {
    const d = new Date();
    if (s && /^\d{2}:\d{2}$/.test(s)) {
        const [h, m] = s.split(':').map(Number);
        d.setHours(h, m, 0, 0);
    }
    return d;
};

const exibirData = (s: string): string => {
    if (!s) return '';
    const [ano, mes, dia] = s.split('-');
    return `${dia}/${mes}/${ano}`;
};

export default function CreateEventScreen() {
    const vm = useCreateEventVM();

    const [pickerAberto, setPickerAberto] = useState<'hora' | 'inicio' | 'fim' | null>(null);

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

                        {/* SELETOR DE TIPO */}
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

                        {/* HORARIO - abre time picker */}
                        <Text style={styles.label}>Horário</Text>
                        <TouchableOpacity
                            style={[styles.pickerBtn, vm.erros.hora && styles.pickerBtnError]}
                            onPress={() => setPickerAberto('hora')}
                            disabled={vm.salvando}
                        >
                            <Icon name="calendar" size={20} color="rgba(255,255,255,0.8)" />
                            <Text style={[styles.pickerValor, !vm.hora && styles.pickerPlaceholder]}>
                                {vm.hora || 'Escolher horário'}
                            </Text>
                        </TouchableOpacity>
                        {vm.erros.hora && <Text style={styles.erroTexto}>{vm.erros.hora}</Text>}

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

                    {/* PERIODO */}
                    <Text style={styles.sectionLabel}>PERÍODO</Text>
                    <GlassCard tint="dark" intensity={60}>
                        {/* DATA INICIO - abre date picker */}
                        <Text style={styles.label}>Data de início</Text>
                        <TouchableOpacity
                            style={[styles.pickerBtn, vm.erros.dataInicio && styles.pickerBtnError]}
                            onPress={() => setPickerAberto('inicio')}
                            disabled={vm.salvando}
                        >
                            <Icon name="calendar" size={20} color="rgba(255,255,255,0.8)" />
                            <Text style={[styles.pickerValor, !vm.dataInicio && styles.pickerPlaceholder]}>
                                {vm.dataInicio ? exibirData(vm.dataInicio) : 'Escolher data'}
                            </Text>
                        </TouchableOpacity>
                        {vm.erros.dataInicio && <Text style={styles.erroTexto}>{vm.erros.dataInicio}</Text>}

                        {/* DATA FIM - opcional */}
                        <Text style={[styles.label, { marginTop: SPACING.md }]}>Data de fim (opcional)</Text>
                        <View style={styles.fimRow}>
                            <TouchableOpacity
                                style={[styles.pickerBtn, { flex: 1 }, vm.erros.dataFim && styles.pickerBtnError]}
                                onPress={() => setPickerAberto('fim')}
                                disabled={vm.salvando}
                            >
                                <Icon name="calendar" size={20} color="rgba(255,255,255,0.8)" />
                                <Text style={[styles.pickerValor, !vm.dataFim && styles.pickerPlaceholder]}>
                                    {vm.dataFim ? exibirData(vm.dataFim) : 'Sem data de fim'}
                                </Text>
                            </TouchableOpacity>
                            {vm.dataFim ? (
                                <TouchableOpacity
                                    onPress={() => vm.setDataFim('')}
                                    style={styles.limparBtn}
                                    accessibilityLabel="Limpar data de fim"
                                >
                                    <Icon name="x" size={18} color="rgba(255,255,255,0.7)" />
                                </TouchableOpacity>
                            ) : null}
                        </View>
                        {vm.erros.dataFim && <Text style={styles.erroTexto}>{vm.erros.dataFim}</Text>}

                        <View style={styles.dicaRow}>
                            <Icon name="info" size={16} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.dicaText}>
                                Sem data de fim, o evento se repete por 90 dias.
                            </Text>
                        </View>
                    </GlassCard>

                    {/* ACOES */}
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

            {/* PICKERS NATIVOS (aparecem como dialog no Android) */}
            {pickerAberto === 'hora' && (
                <DateTimePicker
                    value={parseHora(vm.hora)}
                    mode="time"
                    is24Hour={true}
                    onChange={(event, selectedDate) => {
                        setPickerAberto(null);
                        if (event.type === 'set' && selectedDate) {
                            vm.setHora(formatarHora(selectedDate));
                        }
                    }}
                />
            )}

            {pickerAberto === 'inicio' && (
                <DateTimePicker
                    value={parseData(vm.dataInicio)}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setPickerAberto(null);
                        if (event.type === 'set' && selectedDate) {
                            vm.setDataInicio(formatarData(selectedDate));
                        }
                    }}
                />
            )}

            {pickerAberto === 'fim' && (
                <DateTimePicker
                    value={vm.dataFim ? parseData(vm.dataFim) : parseData(vm.dataInicio)}
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setPickerAberto(null);
                        if (event.type === 'set' && selectedDate) {
                            vm.setDataFim(formatarData(selectedDate));
                        }
                    }}
                />
            )}
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
        color: '#fff',
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

    pickerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        minHeight: 48,
    },
    pickerBtnError: {
        borderColor: '#ff8478',
    },
    pickerValor: {
        fontSize: FONT_SIZES.md,
        color: '#fff',
    },
    pickerPlaceholder: {
        color: 'rgba(255,255,255,0.5)',
    },
    erroTexto: {
        fontSize: FONT_SIZES.xs,
        color: '#ff8478',
        marginTop: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    fimRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    limparBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: BORDER_RADIUS.md,
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
