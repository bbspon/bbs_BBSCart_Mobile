import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const API_BASE = 'https://bbscart.com';
const UPLOADS = '/uploads';

const normalizeImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${UPLOADS}/${encodeURIComponent(img)}`;
};

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params || {};
  const cart = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist, fetchWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const galleryRef = useRef(null);

  // Refresh wishlist when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [fetchWishlist])
  );

  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_BASE}/api/products/public/${productId}`
        );

        const p = res.data;

        const gallery = [
          ...(Array.isArray(p.gallery_imgs)
            ? p.gallery_imgs.map(normalizeImg)
            : []),
          normalizeImg(p.product_img),
          normalizeImg(p.product_img2),
        ].filter(Boolean);

        setProduct({
          ...p,
          _gallery: gallery,
        });
      } catch (err) {
        console.log('Product load failed', err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // Check if product is in wishlist
  const isWishlisted = wishlistItems.some((wItem) => {
    const wProductId = wItem.product?._id || wItem._id || wItem.id;
    return (
      wProductId === product?._id ||
      wProductId?.toString() === product?._id?.toString()
    );
  });

  const handleWishlistToggle = async () => {
    if (!product) return;

    try {
      const result = isWishlisted
        ? await removeFromWishlist(product._id)
        : await addToWishlist(product._id);
      
      if (result && !result.success) {
        Alert.alert('Error', result.error || 'Failed to update wishlist');
      } else {
        // Show success feedback
        if (isWishlisted) {
          // Product removed from wishlist
          console.log('Removed from wishlist');
        } else {
          // Product added to wishlist
          console.log('Added to wishlist');
        }
        // Refresh wishlist to update UI
        fetchWishlist();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update wishlist. Please try again.');
      console.log('Wishlist toggle error:', error);
    }
  };

  const addToCart = () => {
    if (!cart?.addItem || !product) return;

    cart.addItem({
      productId: product._id,
      name: product.name,
      price: product.price ?? 0,
      image: product._gallery?.[0] || null,
      qty: 1,
      variantId: null,
    });

    navigation.navigate('Cart');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* IMAGE GALLERY */}
        <View style={styles.imageGalleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            ref={galleryRef}
            showsHorizontalScrollIndicator={false}
            onScroll={(e) =>
              setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))
            }
          >
            {product._gallery.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.image} />
            ))}
          </ScrollView>
          {/* Floating Wishlist Button */}
          <TouchableOpacity
            style={styles.floatingWishlistBtn}
            onPress={handleWishlistToggle}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={26}
              color={isWishlisted ? '#e91e63' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* THUMBNAILS */}
        <View style={styles.thumbRow}>
          {product._gallery.map((img, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                galleryRef.current.scrollTo({ x: i * width })
              }
            >
              <Image
                source={{ uri: img }}
                style={[
                  styles.thumb,
                  activeImg === i && styles.thumbActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* DETAILS */}
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {product.name}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.mrp && (
              <Text style={styles.mrp}>₹{product.mrp}</Text>
            )}
            {discount > 0 && (
              <Text style={styles.discount}>{discount}% off</Text>
            )}
          </View>

          {/* META */}
          <View style={styles.metaBox}>
            <Text>SKU: {product.SKU || '-'}</Text>
            <Text>Stock: {product.stock ?? '-'}</Text>
            <Text>Weight: {product.weight || '-'}</Text>
            <Text>
              Dimensions:{' '}
              {product.dimensions
                ? `${product.dimensions.length || 0} × ${product.dimensions.width || 0} × ${product.dimensions.height || 0}`
                : '-'}
            </Text>
            <Text>
              Category: {product.category_id?.name || '-'}
            </Text>
            <Text>
              Subcategory: {product.subcategory_id?.name || '-'}
            </Text>
          </View>

          {/* DESCRIPTION */}
          {product.description && (
            <>
              <Text style={styles.section}>Description</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.outlineBtn} onPress={addToCart}>
          <Text style={styles.outlineText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fillBtn}
          onPress={() => {
            addToCart();
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.fillText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageGalleryContainer: {
    position: 'relative',
  },
  image: { width, height: 280, resizeMode: 'contain' },
  floatingWishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbRow: { flexDirection: 'row', padding: 10 },
  thumb: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  thumbActive: { borderColor: '#96B416', borderWidth: 2 },
  card: { padding: 16, backgroundColor: '#fff' },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    position: 'relative',
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#333',
    lineHeight: 26,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 24, fontWeight: '700', color: '#96B416' },
  mrp: {
    marginLeft: 8,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  discount: { marginLeft: 8, color: 'green' },
  metaBox: { marginTop: 12 },
  section: { marginTop: 16, fontWeight: '700' },
  desc: { marginTop: 6, color: '#444' },
  footer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#96B416',
    padding: 14,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  fillBtn: {
    flex: 1,
    backgroundColor: '#96B416',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineText: { color: '#96B416', fontWeight: '700' },
  fillText: { color: '#fff', fontWeight: '700' },
});
