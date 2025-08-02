import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Home from '../screens/Home';
import Complaint from '../screens/Complaint';
import Update from '../screens/Update';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import StatusUpdate from '../screens/StatusUpdate';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                let IconComponent = AntDesign;

                if (route.name === 'Home') {
                    iconName = 'home';
                } else if (route.name === 'Complaints') {
                    IconComponent = Ionicons;
                    iconName = 'alert-circle-outline';
                } else if (route.name === 'Updates') {
                    IconComponent = Ionicons;
                    iconName = 'shield-checkmark-outline';
                } else {
                    IconComponent = Ionicons;
                    iconName = 'person-outline'
                }

                return <IconComponent name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: '#007bff',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                paddingBottom: 5,
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 5,
            },
        })}
    >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Complaints" component={Complaint} />
        <Tab.Screen name="Updates" component={Update} />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
);

const AppNavigation = () => {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === null) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isAuthenticated ? (
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <>
                        <Stack.Screen
                            name="MainTabs"
                            component={BottomTabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="ChangeStatus"
                            component={StatusUpdate}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;