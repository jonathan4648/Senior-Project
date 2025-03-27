import { FontAwesome } from "@expo/vector-icons";

export default function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    iconSet: 'Font Awesome' | 'Feather' | 'MatericalCommunityIcons'
  
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }