import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { BORDER_RADIUS, SPACING } from '@theme/spacing';

// --- Tradução pt-BR a lib vem em inglês por padrão ---
LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ],
    monthNamesShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ],
    dayNames: [
        'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const VERDE = '#1d9e75';

interface AgendaCalendarProps {

    dataSelecionada: string;
  
    diasComEvento: string[];
  
    onDiaSelecionado: (data: string) => void;

    onMudarMes?: (mesAnoISO: string) => void;
}

export default function AgendaCalendar({
    dataSelecionada,
    diasComEvento,
    onDiaSelecionado,
    onMudarMes,
}: AgendaCalendarProps) {
 
    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        diasComEvento.forEach((dia) => {
            marks[dia] = {
                marked: true,
                dotColor: VERDE,
            };
        });

        marks[dataSelecionada] = {
            ...(marks[dataSelecionada] || {}),
            selected: true,
            selectedColor: VERDE,
        };

        return marks;
    }, [diasComEvento, dataSelecionada]);

    return (
        <View style={styles.wrapper}>
            <Calendar
                current={dataSelecionada}
                onDayPress={(day) => onDiaSelecionado(day.dateString)}
                onMonthChange={(m) => {
                    onMudarMes?.(m.dateString);
                }}
                markedDates={markedDates}
                firstDay={0} 
                enableSwipeMonths
                theme={{
                    calendarBackground: 'transparent',
                    backgroundColor: 'transparent',
                    monthTextColor: '#fff',
                    textMonthFontWeight: '600',
                    textMonthFontSize: 18,
                    arrowColor: '#fff',
                    textSectionTitleColor: 'rgba(255,255,255,0.6)',
                    dayTextColor: 'rgba(255,255,255,0.9)',
                    todayTextColor: VERDE,
                    selectedDayTextColor: '#fff',
                    selectedDayBackgroundColor: VERDE,
                    textDisabledColor: 'rgba(255,255,255,0.25)',
                    textDayFontSize: 15,
                    textDayHeaderFontSize: 12,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingVertical: SPACING.sm,
    },
});
