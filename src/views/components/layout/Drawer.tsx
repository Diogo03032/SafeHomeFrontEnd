import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAppStore } from '@store/useAppStore';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';


interface MenuItem {
    icone: string;
    titulo: string;
    rota: string;
    tipo: 'tab' | 'drawer';  
}

const MENU_ITEMS: MenuItem[] = [
   
    { icone: '🏠', titulo: 'Início',         rota: 'Home',     tipo: 'tab' },
    { icone: '📅', titulo: 'Agenda',         rota: 'Agenda',   tipo: 'tab' },
    { icone: '🔌', titulo: 'Dispositivos',   rota: 'IoT',      tipo: 'tab' },
    { icone: '👥', titulo: 'Meus contatos',  rota: 'Contacts', tipo: 'tab' },
    { icone: '👤', titulo: 'Perfil',         rota: 'Profile',  tipo: 'tab' },

    // Rotas só do drawer (sem aba)
    { icone: '📊', titulo: 'Estatísticas',   rota: 'Stats',    tipo: 'drawer' },
    { icone: '🎨', titulo: 'Temas',          rota: 'Themes',   tipo: 'drawer' },
];

export default function DrawerMenu(props: DrawerContentComponentProps) {
    const colors = getThemeColors('forest');
    const user = useAppStore((s) => s.user);
    const logout = useAppStore((s) => s.logout);
    const primeiraLetra = user?.nome?.charAt(0).toUpperCase() ?? '?';
    const primeiroNome = user?.nome?.split(' ')[0] ?? 'usuário';
    const navegar = (item: MenuItem) => {
        if (item.tipo === 'tab') {
            props.navigation.navigate('TabRoot', { screen: item.rota });
        } else {
            props.navigation.navigate(item.rota);
        }
        props.navigation.closeDrawer();
    };

    const handleLogout = async () => {
        await logout();
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
                {/* Separador: Tabs */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                    NAVEGAÇÃO
                </Text>

                {MENU_ITEMS.filter(i => i.tipo === 'tab').map((item) => (
                    <TouchableOpacity
                        key={item.rota}
                        onPress={() => navegar(item)}
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

                {/* Separador: Configurações */}
                <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: SPACING.md }]}>
                    CONFIGURAÇÕES
                </Text>

                {MENU_ITEMS.filter(i => i.tipo === 'drawer').map((item) => (
                    <TouchableOpacity
                        key={item.rota}
                        onPress={() => navegar(item)}
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
    sectionLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold as any,
        letterSpacing: 1,
        marginLeft: SPACING.md,
        marginBottom: SPACING.xs,
        marginTop: SPACING.sm,
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
