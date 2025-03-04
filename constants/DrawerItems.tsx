import Today from '@/screens/Today';
import Settings from '@/screens/Settings';
import Saved from '@/screens/Saved';
import Refer from '@/screens/Refer';

type DrawerItem = {
    name: string;
    component: React.ComponentType<any>;
    iconType: string;
    iconName: string;
}
const DrawerItems: DrawerItem[] = [
    {
        name:'Today',
        component: Today,
        iconType: 'Material',
        iconName: 'face-today'
    },
    {
        name: 'Settings',
        component: Settings,
        iconType: 'Feather',
        iconName: 'settings'
    },
    {
        name: 'Saved',
        component: Saved,
        iconType: 'Material',
        iconName: 'bookmark-check-outline'
    },
    {
        name: 'Refer',
        component: Refer,
        iconType: 'FontAwesome5',
        iconName: 'user-friends'
    }
];
export default DrawerItems;