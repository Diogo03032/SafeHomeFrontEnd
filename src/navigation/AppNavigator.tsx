import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useAppStore } from '@store/useAppStore';

// Telas de autenticação (Stack)
import SplashScreen from '@screens/Auth/SplashScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import RegisterScreen from '@screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/Auth/ForgotPasswordScreen';

// Telas das tabs
import HomeScreen from '@screens/Home/HomeScreen';
import AgendaScreen from '@screens/Agenda/AgendaScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';
import IoTListScreen from '@screens/IoT/IoTListScreen';
import ContactsListScreen from '@screens/Contacts/ContactsListScreen';

// Telas só do drawer
import StatsScreen from '@screens/Stats/StatsScreen';
import ThemesScreen from '@screens/Settings/ThemeScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import AccessibilityScreen from '@screens/Settings/AccessibilityScreen';
import PermissionsScreen from '@screens/Settings/PermissionsScreen';
import AboutScreen from '@screens/Settings/AboutScreen';

// Telas modais/extras
import AddContactScreen from '@screens/Contacts/AddContactScreen';
import PanicCountdownScreen from '@screens/Emergency/PanicCountdownScreen';

// Componentes
import DrawerMenu from '@components/layout/Drawer';
import { Icon } from '@components/ui/Icon';

// =============== Types ==================

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    DrawerRoot: undefined;
    AddContact: undefined;
    PanicCountdown: undefined;
};

export type DrawerParamList = {
    TabRoot: undefined;
    Stats: undefined;
    Themes: undefined;
    Settings: undefined;
    Accessibility: undefined;
    Permissions: undefined;
    About: undefined;
};

export type TabParamList = {
    Home: undefined;
    IoT: undefined;
    Agenda: undefined;
    Contacts: undefined;
    Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tema customizado pra Navigation Container (fundo transparente)
const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
        card: 'transparent',
    },
};


// ============================================================================
// TABBAR COM GLASS EFFECT
// ============================================================================

function TabBarBackground() {
    return (
        <BlurView
            intensity={Platform.OS === 'ios' ? 70 : 100}
            tint="dark"
            style={{
                flex: 1,
                borderTopWidth: 1,
                borderTopColor: 'rgba(255,255,255,0.15)',
            }}
        />
    );
}

function TabRoot() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#5cd99e',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
                tabBarStyle: {
                    position: 'absolute',
                    borderTopWidth: 0,
                    elevation: 0,
                    backgroundColor: 'transparent',
                    height: 64,
                    paddingBottom: 10,
                    paddingTop: 6,
                },
                tabBarBackground: () => <TabBarBackground />,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Início',
                    tabBarIcon: ({ color, size }) => <Icon name="home" size={size ?? 22} color={color} />,
                }}
            />
            <Tab.Screen
                name="IoT"
                component={IoTListScreen}
                options={{
                    tabBarLabel: 'Dispositivos',
                    tabBarIcon: ({ color, size }) => <Icon name="smart-home" size={size ?? 22} color={color} />,
                }}
            />
            <Tab.Screen
                name="Agenda"
                component={AgendaScreen}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: ({ color, size }) => <Icon name="calendar" size={size ?? 22} color={color} />,
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsListScreen}
                options={{
                    tabBarLabel: 'Contatos',
                    tabBarIcon: ({ color, size }) => <Icon name="users" size={size ?? 22} color={color} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => <Icon name="user" size={size ?? 22} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}


// ============================================================================
// HEADER COM GLASS EFFECT
// ============================================================================

function HeaderBackground() {
    return (
        <BlurView
            intensity={Platform.OS === 'ios' ? 80 : 100}
            tint="dark"
            style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.15)',
            }}
        />
    );
}

function DrawerRoot() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerMenu {...props} />}
            screenOptions={{
                headerTransparent: true,
                headerBackground: () => <HeaderBackground />,
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
                drawerStyle: {
                    width: 280,
                    backgroundColor: 'transparent',
                },
                drawerType: 'front',
                overlayColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <Drawer.Screen
                name="TabRoot"
                component={TabRoot}
                options={{ title: 'SafeHome' }}
            />
            <Drawer.Screen
                name="Stats"
                component={StatsScreen}
                options={{ title: 'Estatísticas' }}
            />
            <Drawer.Screen
                name="Themes"
                component={ThemesScreen}
                options={{ title: 'Temas' }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Configurações' }}
            />
            <Drawer.Screen
                name="Accessibility"
                component={AccessibilityScreen}
                options={{ title: 'Acessibilidade' }}
            />
            <Drawer.Screen
                name="Permissions"
                component={PermissionsScreen}
                options={{ title: 'Permissões' }}
            />
            <Drawer.Screen
                name="About"
                component={AboutScreen}
                options={{ title: 'Sobre' }}
            />
        </Drawer.Navigator>
    );
}

export default function AppNavigator() {
    const hydrate = useAppStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <NavigationContainer theme={NavigationTheme}>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="DrawerRoot" component={DrawerRoot} />
                <Stack.Screen
                    name="AddContact"
                    component={AddContactScreen}
                    options={{ presentation: 'modal' }}
                />
                <Stack.Screen
                    name="PanicCountdown"
                    component={PanicCountdownScreen}
                    options={{ presentation: 'fullScreenModal' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
