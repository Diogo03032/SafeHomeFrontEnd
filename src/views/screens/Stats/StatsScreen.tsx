import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useStatsVM } from '@viewmodels/useStatsVM';
import { getThemeColors } from '@theme/colors';
import { SPACING, BORDER_RADIUS } from '@theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '@theme/typography';

interface AnelProps {
    porcentagem: number;
    cor: string;
    corFundo: string;
    tamanho?: number;
    espessura?: number;
}

function AnelDeProgresso({
    porcentagem,
    cor,
    corFundo,
    tamanho = 180,
    espessura = 16,
}: AnelProps) {
    const raio = (tamanho - espessura) / 2;
    const circunferencia = 2 * Math.PI * raio;
    const preenchimento = (porcentagem / 100) * circunferencia;
    const vazio = circunferencia - preenchimento;

    return (
        <Svg width={tamanho} height={tamanho} viewBox={`0 0 ${tamanho} ${tamanho}`}>
            {/* Fundo do anel */}
            <Circle
                cx={tamanho / 2}
                cy={tamanho / 2}
                r={raio}
                stroke={corFundo}
                strokeWidth={espessura}
                fill="none"
            />
            {/* Preenchimento (rotacionado pra começar do topo) */}
            <Circle
                cx={tamanho / 2}
                cy={tamanho / 2}
                r={raio}
                stroke={cor}
                strokeWidth={espessura}
                fill="none"
                strokeDasharray={`${preenchimento} ${vazio}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${tamanho / 2} ${tamanho / 2})`}
            />
        </Svg>
    );
}
