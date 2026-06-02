import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAppStore } from '@store/useAppStore';
import SplashScreen from '@screens/Auth/SplashScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import RegisterScreen from '@screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/Auth/ForgotPasswordScreen';
import HomeScreen from '@screens/Home/HomeScreen';
import AgendaScreen from '@screens/Agenda/AgendaScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';
import StatsScreen from '@screens/Stats/StatsScreen';
import ThemesScreen from '@screens/Settings/ThemeScreen';
import DrawerMenu from '@components/layout/Drawer';
import { View } from 'react-native';
import IoTListScreen from '@screens/IoT/IoTListScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import AboutScreen from '@screens/Settings/AboutScreen';
import AccessibilityScreen from '@screens/Settings/AccessibilityScreen';
import PermissionsScreen from '@screens/Settings/PermissionsScreen';
import PanicCountdownScreen from '@screens/Emergency/PanicCountdownScreen';

function IoTStubScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f5f1' }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🔌</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Dispositivos IoT</Text>
            <Text style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Em desenvolvimento</Text>
        </View>
    );
}

function ContactsStubScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f5f1' }}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>👥</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Meus Contatos</Text>
            <Text style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Em desenvolvimento</Text>
        </View>
    );
}

// TIPAGENS

// Rotas do Stack principal (autenticação)
export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    DrawerRoot: undefined;
    PanicCountdown: undefined;
};

// Rotas do Drawer (menu lateral)
export type DrawerParamList = {
    TabRoot: undefined;
    Stats: undefined;
    Themes: undefined;
    Settings: undefined;        
    Accessibility: undefined;   
    Permissions: undefined;     
    About: undefined;
};

// Rotas do Tab Navigator (barra inferior)
export type TabParamList = {
    Home: undefined;
    IoT: undefined;
    Agenda: undefined;
    Contacts: undefined;
    Profile: undefined;
};

// NAVIGATORS

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabRoot() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false, // o header já vem do Drawer
                tabBarActiveTintColor: '#1d9e75',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e5ebe7',
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
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
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>🏠</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Agenda"
                component={AgendaScreen}
                options={{
                    tabBarLabel: 'Agenda',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>📅</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Contacts"
                component={ContactsStubScreen}
                options={{
                    tabBarLabel: 'Contatos',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>👥</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 22, color }}>👤</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="IoT"
                component={IoTListScreen} 
            />
        </Tab.Navigator>
    );
}

function DrawerRoot() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerMenu {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#1d9e75' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                drawerStyle: { width: 280 },
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
            <Drawer.Screen name="Settings" component={SettingsScreen} 
                options={{ title: 'Configurações' }} />
            <Drawer.Screen name="Accessibility" component={AccessibilityScreen} 
                options={{ title: 'Acessibilidade' }} />
            <Drawer.Screen name="Permissions" component={PermissionsScreen} 
                options={{ title: 'Permissões' }} />
            <Drawer.Screen name="About" component={AboutScreen} 
                options={{ title: 'Sobre' }} />
        </Drawer.Navigator>
        
    );
}

export default function AppNavigator() {
    const hydrate = useAppStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="DrawerRoot" component={DrawerRoot} />
                <Stack.Screen name="PanicCountdown" component={PanicCountdownScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
