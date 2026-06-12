import React, { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { useAppStore } from "@store/useAppStore";
import { SPACING } from "@theme/spacing";
import { FONT_SIZES, FONT_WEIGHTS } from "@theme/typography";
import type { RootStackParamList } from "@navigation/AppNavigator";
import ScreenContainer from "@components/layout/ScreenContainer";

type Navigation = NativeStackNavigationProp<RootStackParamList, "Splash">;

// Verde neon do app
const VERDE_NEON = "#5cd99e";

// Tamanhos do conjunto 
const CIRCULO = 160;         
const ANEL = CIRCULO + 24;    
const RESPIRO = 10;           

export default function SplashScreen() {
  const navigation = useNavigation<Navigation>();
  const authStatus = useAppStore((s) => s.authStatus);

  useEffect(() => {
    if (authStatus === "loading") return;

    const timer = setTimeout(() => {
      if (authStatus === "logged_in") {
        navigation.replace("DrawerRoot");
      } else {
        navigation.replace("Login");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [authStatus, navigation]);

  return (
    <ScreenContainer variant="auth" overlayOpacity={0.5}>
      <View style={styles.wrapper}>
        {/* CONJUNTO CENTRAL: anel verde atras + circulo glass + logo */}
        <View style={styles.centro}>
          {/* Anel de loading verde neon (atras, maior) */}
          <View style={styles.anelWrapper}>
            <ActivityIndicator size="large" color={VERDE_NEON} />
          </View>

          {/* Circulo glasscard por cima, cobrindo o meio do anel */}
          <View style={styles.circuloGlass}>
            <BlurView
              intensity={40}
              tint="dark"
              style={styles.blur}
            >
              <Image
                source={require("@assets/images/iconeSafeHome.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </BlurView>
          </View>
        </View>

        {/* SAUDACAO */}
        <View style={styles.saudacaoWrapper}>
          <Text style={styles.appName}>Bem-vindo ao SafeHome</Text>
          <Text style={styles.tagline}>Sua rede de apoio digital</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centro: {
    width: ANEL,
    height: ANEL,
    alignItems: "center",
    justifyContent: "center",
  },
  // O spinner fica numa camada absoluta, centralizado, atras do circulo
  anelWrapper: {
    position: "absolute",
    width: ANEL,
    height: ANEL,
    alignItems: "center",
    justifyContent: "center",
  },
  // Circulo de vidro por cima
  circuloGlass: {
    width: CIRCULO,
    height: CIRCULO,
    borderRadius: CIRCULO / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    // sombra/glow suave
    shadowColor: VERDE_NEON,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  blur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  logo: {
    width: CIRCULO - RESPIRO * 2,
    height: CIRCULO - RESPIRO * 2,
    borderRadius: (CIRCULO - RESPIRO * 2) / 2,
  },
  saudacaoWrapper: {
    position: "absolute",
    bottom: 96,
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  appName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold as any,
    color: "#fff",
    letterSpacing: 1,
    textAlign: "center",
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: VERDE_NEON,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
});
