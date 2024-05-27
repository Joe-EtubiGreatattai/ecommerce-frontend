// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Store from '../screens/ProductList';
import Details from '../screens/ProductDetails';
import Cart from '../screens/Cart';
import Login from '../screens/Login';
import Checkout from '../screens/Checkout';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProductStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Store" component={Store} />
      <Stack.Screen name="Details" component={Details} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cartpage" component={Cart} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Checkout" component={Checkout} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Product" component={ProductStack} />
      <Stack.Screen name="Cart" component={CartStack} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
