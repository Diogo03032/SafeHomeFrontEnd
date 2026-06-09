import React from 'react';
import {
    Home,
    Calendar,
    Users,
    User,
    UserPlus,
    HousePlug,
    ChartLine,
    Palette,
    Settings,
    Info,
    LogOut,
    Shield,
    Flame,
    DoorOpen,
    Radio,
    Lightbulb,
    Volume2,
    Siren,
    Plug,
    Check,
    X,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    Search,
    Share2,
    Bell,
    Lock,
    MapPin,
    Eye,
    Heart,
    Menu,
    ArrowLeft,
    Pencil,
    Save,
    Camera,
    Mic,
    type LucideIcon,
} from 'lucide-react-native';

// Mapa de nomes → componentes
const ICONS = {
    // Tabs
    home: Home,
    calendar: Calendar,
    users: Users,
    user: User,
    'user-plus': UserPlus,
    'smart-home': HousePlug,

    // Drawer
    'chart-line': ChartLine,
    palette: Palette,
    settings: Settings,
    info: Info,
    'log-out': LogOut,
    shield: Shield,

    // IoT devices
    flame: Flame,
    'door-open': DoorOpen,
    radio: Radio,
    lightbulb: Lightbulb,
    volume: Volume2,
    siren: Siren,
    plug: Plug,

    // Status & ações
    check: Check,
    x: X,
    alert: AlertTriangle,
    'chevron-right': ChevronRight,
    'chevron-left': ChevronLeft,
    plus: Plus,
    trash: Trash2,
    search: Search,
    share: Share2,

    // Comunicação & segurança
    bell: Bell,
    lock: Lock,
    location: MapPin,
    eye: Eye,
    heart: Heart,
    menu: Menu,
    'arrow-left': ArrowLeft,
    pencil: Pencil,
    save: Save,
    camera: Camera,
    mic: Mic,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export function Icon({
    name,
    size = 24,
    color = '#000',
    strokeWidth = 2,
}: IconProps) {
    const Component = ICONS[name];
    return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}

export default Icon;
