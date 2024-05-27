import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const Details = () => {
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDetails(productId);
  }, [productId]);

  const fetchDetails = async (productId) => {
    try {
      const response = await axios.get(`https://ecommerce-backend-eiv5.onrender.com/api/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const addToCart = async () => {
    try {
      const item = { productId, quantity };
      const isLoggedIn = true; // Placeholder for login status, replace with actual logic
      if (isLoggedIn) {
        await addToAsyncStorage(item);
      } else {
        await axios.post('https://ecommerce-backend-eiv5.onrender.com/api/cart', item);
      }
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };

  const addToAsyncStorage = async (item) => {
    try {
      let cart = await AsyncStorage.getItem('cart');
      cart = cart ? JSON.parse(cart) : [];
      cart.push(item);
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to AsyncStorage:', error);
    }
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Card.Cover source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
        <Card.Content>
          <Title style={styles.productName}>{product.name}</Title>
          <Paragraph style={styles.productPrice}>${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Paragraph>
          <Divider style={styles.divider} />
          <View style={styles.quantityContainer}>
            <Button mode="outlined" onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} style={styles.quantityButton}>
              -
            </Button>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Button mode="outlined" onPress={() => setQuantity(quantity + 1)} style={styles.quantityButton}>
              +
            </Button>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={addToCart} style={styles.addButton}>
            Add to Cart
          </Button>
        </Card.Actions>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
  },
  productImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    height: 250,
    backgroundColor:'#fff'
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: '#333',
  },
  productPrice: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    marginHorizontal: 10,
  },
  quantityText: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  addButton: {
    marginVertical: 20,
    width:'100%'
  },
});

export default Details;
