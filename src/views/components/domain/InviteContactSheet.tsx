import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Icon } from '@components/ui/Icon';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface InviteContactSheetProps {
    visivel: boolean;
    onFechar: () => void;
    onConvidar: () => void;       
    onAdicionarExistente: () => void; 
}

export default function InviteContactSheet({
    visivel,
    onFechar,
    onConvidar,
    onAdicionarExistente,
}: InviteContactSheetProps) {
    return (
        <Modal
            visible={visivel}
            transparent
            animationType="slide"
            onRequestClose={onFechar}
        >
            {/* Fundo escuro: toque fora fecha */}
            <Pressable style={styles.backdrop} onPress={onFechar}>
                {/* Pressable interno impede que o toque no sheet feche */}
                <Pressable style={styles.sheetWrapper} onPress={(e) => e.stopPropagation()}>
                    <BlurView intensity={80} tint="dark" style={styles.sheet}>
                        {/* Puxador */}
                        <View style={styles.handle} />

                        <Text style={styles.titulo}>Adicionar à rede de apoio</Text>
                        <Text style={styles.subtitulo}>
                            Convide alguém pra baixar o app ou adicione quem já usa o SafeHome.
                        </Text>

                        {/* Opção 1: convidar (share nativo) */}
                        <TouchableOpacity
                            style={styles.opcao}
                            onPress={() => {
                                onFechar();
                                onConvidar();
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Convidar por mensagem"
                        >
                            <View style={[styles.opcaoIcone, { backgroundColor: 'rgba(29,158,117,0.25)' }]}>
                                <Icon name="share" size={24} color="#5cd99e" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.opcaoTitulo}>Convidar por mensagem</Text>
                                <Text style={styles.opcaoHint}>
                                    WhatsApp, SMS, e-mail e mais
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>

                        {/* Opção 2: adicionar quem já tem o app */}
                        <TouchableOpacity
                            style={styles.opcao}
                            onPress={() => {
                                onFechar();
                                onAdicionarExistente();
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Adicionar quem já tem o app"
                        >
                            <View style={[styles.opcaoIcone, { backgroundColor: 'rgba(92,217,158,0.15)' }]}>
                                <Icon name="user-plus" size={24} color="#5cd99e" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.opcaoTitulo}>Já tem o app?</Text>
                                <Text style={styles.opcaoHint}>
                                    Buscar usuário pelo e-mail
                                </Text>
                            </View>
                            <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>

                        {/* Cancelar */}
                        <TouchableOpacity style={styles.cancelar} onPress={onFechar}>
                            <Text style={styles.cancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
                    </BlurView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheetWrapper: {
        
    },
    sheet: {
        borderTopLeftRadius: BORDER_RADIUS.xl ?? 24,
        borderTopRightRadius: BORDER_RADIUS.xl ?? 24,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl ?? 40,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: SPACING.lg,
    },
    titulo: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold as any,
        color: '#fff',
    },
    subtitulo: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.xs,
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    opcao: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginBottom: SPACING.sm,
    },
    opcaoIcone: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    opcaoTitulo: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold as any,
        color: '#fff',
    },
    opcaoHint: {
        fontSize: FONT_SIZES.xs,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 2,
    },
    cancelar: {
        marginTop: SPACING.sm,
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    cancelarTexto: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
        color: 'rgba(255,255,255,0.8)',
    },
});
