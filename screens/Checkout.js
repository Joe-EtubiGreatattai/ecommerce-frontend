import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from "react-native"; // Import ActivityIndicator
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Checkout = ({ route }) => {
  const navigation = useNavigation();
  const cart = route.params?.cart || [];
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    fetchDetails();
  }, [cart]);

  const fetchDetails = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const Details = await Promise.all(
        cart.map((item) =>
          axios.get(
            `https://ecommerce-backend-eiv5.onrender.com/api/products/${item.productId}`
          )
        )
      );
      const fetchedProducts = Details.map((response) => response.data);
      setProducts(fetchedProducts);
      calculateTotalPrice(fetchedProducts);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const calculateTotalPrice = (fetchedProducts) => {
    let total = 0;
    cart.forEach((item) => {
      const product = fetchedProducts.find(
        (prod) => prod._id === item.productId
      );
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setTotalPrice(total);
  };

  const handleOrder = () => {
    setLoading(true); // Set loading to true when processing order
    setTimeout(() => {
      setLoading(false); // Set loading to false after processing order
      Alert.alert("Order Received", "Your order has been received.");
      navigation.navigate("Store");
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Summary</Text>
      {loading ? ( // Display loading indicator if loading is true
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        cart.map((item, index) => {
          const product = products.find((prod) => prod._id === item.productId);
          return (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.product}>
                  {product ? product.name : "Loading..."}
                </Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>
                  Price: $
                  {product
                    ? (product.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "..."}
                </Text>
              </Card.Content>
            </Card>
          );
        })
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Price: $
          {totalPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      <Button title="Submit Order" onPress={handleOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  product: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  totalContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Checkout;
