import { Tabs } from 'expo-router'
import { House, Settings} from 'lucide-react-native';


export default function Layout() {
  return (
     <Tabs screenOptions={{
      tabBarActiveTintColor: '#ffd33d',
      headerStyle: {
        backgroundColor: '#25292e',
      },
      headerShadowVisible: false,
      headerTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: '#25292e',
      },
    }}>
        <Tabs.Screen 
          name="index" 
          options={{
            title:"Home",
            tabBarIcon: ({color, size}) => (
              <House color={"white"} />
            )
        }}/>
        <Tabs.Screen 
          name="Settings" 
          options={{
            title:"Settings",
            tabBarIcon: ({color, size}) => (
              <Settings />
            )       
        }}/>
    </Tabs>
    
  )
}