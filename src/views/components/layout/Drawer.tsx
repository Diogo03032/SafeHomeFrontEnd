import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppStore } from '@store/useAppStore';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface MenuItem {
    icone: string;        // emoji por enquanto, depois trocar por ícones reais
    titulo: string;
    rota: string;
}

// Lista de itens do drawer
const MENU_ITEMS: MenuItem[] = [
    { icone: '🏠', titulo: 'Início',         rota: 'Home' },
    { icone: '📅', titulo: 'Agenda',         rota: 'Agenda' },
    { icone: '📊', titulo: 'Estatísticas',   rota: 'Stats' },
    { icone: '👥', titulo: 'Meus contatos',  rota: 'Contacts' },
    { icone: '🔌', titulo: 'Dispositivos',   rota: 'IoT' },
    { icone: '⚙️', titulo: 'Configurações',  rota: 'Settings' },
    { icone: '🎨', titulo: 'Temas',          rota: 'Themes' },
];

export default function DrawerMenu(props: DrawerContentComponentProps) {
    const colors = getThemeColors('forest');
    const user = useAppStore((s) => s.user);
    const logout = useAppStore((s) => s.logout);

    const primeiraLetra = user?.nome?.charAt(0).toUpperCase() ?? '?';
    const primeiroNome = user?.nome?.split(' ')[0] ?? 'usuário';

    // Navega pra uma rota e fecha o drawer
    const navegar = (rota: string) => {
        // @ts-ignore - rotas dinâmicas
        props.navigation.navigate(rota);
        props.navigation.closeDrawer();
    };

    // Faz logout e volta pro Login
    const handleLogout = async () => {
        await logout();
        // O drawer fecha sozinho ao trocar a rota raiz
        props.navigation.reset({
            index: 0,

            routes: [{ name: 'Login' }],
        });
    };

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={[styles.container, { backgroundColor: colors.surface }]}
        >
            {/* CABEÇALHO COM AVATAR */}
            <View style={[styles.header, { backgroundColor: colors.primaryDark }]}>
                <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primaryDark }]}>
                        {primeiraLetra}
                    </Text>
                </View>
                <Text style={[styles.nome, { color: colors.textOnPrimary }]}>
                    {primeiroNome}
                </Text>
                <Text style={[styles.email, { color: colors.primaryLight }]}>
                    {user?.email ?? ''}
                </Text>
            </View>

            {/* LISTA DE ITENS DE MENU */}
            <View style={styles.menuList}>
                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.rota}
                        onPress={() => navegar(item.rota)}
                        style={styles.menuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.titulo}
                    >
                        <Text style={styles.menuIcone}>{item.icone}</Text>
                        <Text style={[styles.menuTitulo, { color: colors.textPrimary }]}>
                            {item.titulo}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* DIVISOR */}
            <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

            {/* LOGOUT */}
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutItem}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
            >
                <Text style={styles.menuIcone}>🚪</Text>
                <Text style={[styles.menuTitulo, { color: colors.status.danger, fontWeight: '600' }]}>
                    Sair da conta
                </Text>
            </TouchableOpacity>

            {/* RODAPÉ */}
            <Text style={[styles.versao, { color: colors.textSecondary }]}>
                SafeHome v1.0.0
            </Text>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 0 },
    header: {
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
        marginTop: -SPACING.sm,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: BORDER_RADIUS.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    nome: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold as any,
    },
    email: {
        fontSize: FONT_SIZES.sm,
        marginTop: 2,
    },
    menuList: {
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.md,
    },
    menuIcone: { fontSize: 22 },
    menuTitulo: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium as any,
    },
    divider: {
        height: 1,
        marginVertical: SPACING.sm,
        marginHorizontal: SPACING.lg,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
    },
    versao: {
        textAlign: 'center',
        fontSize: FONT_SIZES.xs,
        marginTop: SPACING.lg,
        marginBottom: SPACING.lg,
        fontStyle: 'italic',
    },
});
