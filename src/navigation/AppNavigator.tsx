import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAppStore } from '@store/useAppStore';

// Telas
import SplashScreen from '@screens/Auth/SplashScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import RegisterScreen from '@screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/Auth/ForgotPasswordScreen';
import HomeScreen from '@screens/Home/HomeScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';
import AgendaScreen from '@screens/Agenda/AgendaScreen';
import StatsScreen from '@screens/Stats/StatsScreen';
import ThemesScreen from '@screens/Settings/ThemeScreen';

import DrawerMenu from '@components/layout/Drawer';


export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    DrawerRoot: undefined;
};

export type DrawerParamList = {
    Home: undefined;
    Agenda: undefined;
    Stats: undefined;
    Profile: undefined;
    Themes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Drawer interno: roteia as telas autenticadas e usa o DrawerMenu como conteúdo
function DrawerRoot() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerMenu {...props} />}
            screenOptions={{
                headerShown: true,
                drawerStyle: { width: 280 },
                headerStyle: { backgroundColor: '#1d9e75' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
            <Drawer.Screen name="Agenda" component={AgendaScreen} options={{ title: 'Agenda' }} />
            <Drawer.Screen name="Stats" component={StatsScreen} options={{ title: 'Estatísticas' }} />
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
            <Drawer.Screen name="Themes" component={ThemesScreen} options={{ title: 'Temas' }} />
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
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="DrawerRoot" component={DrawerRoot} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}