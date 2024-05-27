import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Paragraph, Button, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Cart = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const shippingCost = 10; // Placeholder shipping cost
  const taxRate = 0.1; // Placeholder tax rate (10%)

  useEffect(() => {
    fetchCartFromAsyncStorage();
    fetchLoginStatus(); // Fetch user's login status when the component mounts
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      fetchProductsDetails();
    }
  }, [cart]);

  const fetchCartFromAsyncStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Error fetching cart from AsyncStorage:", error);
    }
  };

  const fetchProductsDetails = async () => {
    try {
      const productIds = cart.map((item) => item.productId);
      const response = await axios.get(
        "https://ecommerce-backend-eiv5.onrender.com/api/products",
        {
          params: { ids: productIds.join(",") },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const removeProductFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    // Update AsyncStorage
    AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    try {
      if (isLoggedIn) {
        navigation.navigate("Checkout", { cart });
      } else {
        navigation.navigate("Login"); // Redirect to login screen if not logged in
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const calculateSubtotal = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const item = cart.find((item) => item.productId === productId);
      if (item) {
        return product.price * item.quantity;
      }
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += calculateSubtotal(item.productId);
    });
    // Add shipping cost
    totalPrice += shippingCost;
    // Add tax
    totalPrice += totalPrice * taxRate;
    return totalPrice;
  };

  const fetchLoginStatus = async () => {
    try {
      // Check if a token exists in AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Validate the token (optional)
        // For demo purpose, assuming the token is valid
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching login status:', error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {cart.map((item, index) => {
        const product = products.find((p) => p._id === item.productId);
        if (!product) return null;
        return (
          <Card key={index} style={styles.card}>
            <Card.Cover source={{ uri: product.image }} />
            <Card.Content>
              <Title>{product.name}</Title>
              <Paragraph>Price: ${product.price.toFixed(2)}</Paragraph>
              <Paragraph>Quantity: {item.quantity}</Paragraph>
              <Paragraph>
                Subtotal: $
                {calculateSubtotal(item.productId).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => removeProductFromCart(item.productId)}>
                Remove
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
      <Divider style={styles.divider} />
      <View style={styles.summaryContainer}>
        <Title style={styles.summaryTitle}>Order Summary</Title>
        <Paragraph>Total Items: {cart.length}</Paragraph>
        <Paragraph>
          Subtotal: $
          {calculateTotalPrice().toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Paragraph>
        <Paragraph>
          Shipping: $
          {shippingCost.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Paragraph>
        <Paragraph>
          Tax ({(taxRate * 100).toFixed(2)}%): $
          {((calculateTotalPrice() - shippingCost) * taxRate).toLocaleString(
            undefined,
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
          )}
        </Paragraph>
        <Divider style={styles.divider} />
        <Title>
          Total: $
          {calculateTotalPrice().toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Title>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        >
          Proceed to Checkout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  summaryTitle: {
    marginBottom: 10,
  },
  checkoutButton: {
    marginTop: 10,
  },
});

export default Cart;
