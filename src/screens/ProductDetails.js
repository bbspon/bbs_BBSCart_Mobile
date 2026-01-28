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
const IMAGE_BASE = 'https://bbscart.com/uploads/';
const STATIC_PREFIXES = ['/uploads', '/uploads-bbscart'];
const DEFAULT_PRODUCT_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image';

const norm = (u) => {
  if (!u) return '';
  const s = String(u).trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (STATIC_PREFIXES.some((pre) => s.startsWith(pre + '/'))) {
    return `https://bbscart.com${s}`;
  }
  return `${IMAGE_BASE}${encodeURIComponent(s)}`;
};

const buildGalleryFromProduct = (p) => {
  const urls = [];
  const addAll = (val) => {
    if (!val) return;
    const arr = Array.isArray(val) ? val : [val];
    arr.forEach((x) => {
      const s = String(x).trim();
      if (!s) return;
      const parts = s.includes('|') ? s.split('|').map((t) => t.trim()).filter(Boolean) : [s];
      parts.forEach((part) => urls.push(norm(part)));
    });
  };
  if (p.product_img_url) urls.push(norm(String(p.product_img_url).trim()));
  if (Array.isArray(p.gallery_img_urls)) {
    p.gallery_img_urls.forEach((u) => u && urls.push(norm(String(u).trim())));
  }
  addAll(p.product_img);
  addAll(p.gallery_imgs);
  addAll(p.product_img2);
  if (p.image) urls.push(norm(String(p.image)));
  return [...new Set(urls)].filter(Boolean);
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
  const [mainImageError, setMainImageError] = useState(false);

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
        let gallery = buildGalleryFromProduct(p);
        if (gallery.length === 0) {
          gallery = [DEFAULT_PRODUCT_IMAGE];
        }

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

  useEffect(() => {
    setMainImageError(false);
  }, [activeImg, product?._id]);

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

  const gallery = product._gallery || [];
  const mainImageUri = mainImageError
    ? DEFAULT_PRODUCT_IMAGE
    : (gallery[activeImg] || DEFAULT_PRODUCT_IMAGE);

  const thumbUrls = [
    gallery[0] || DEFAULT_PRODUCT_IMAGE,
    gallery[1] || DEFAULT_PRODUCT_IMAGE,
    gallery[2] || DEFAULT_PRODUCT_IMAGE,
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* MAIN IMAGE (one large image on top, Thiaworld-style) */}
        <View style={styles.imageGalleryContainer}>
          <Image
            source={{ uri: mainImageUri }}
            style={styles.mainImage}
            resizeMode="contain"
            onError={() => setMainImageError(true)}
          />
          {/* Floating Wishlist - aligned top-right over image */}
          <View style={styles.wishlistOverlay} pointerEvents="box-none">
            <TouchableOpacity
              style={styles.floatingWishlistBtn}
              onPress={handleWishlistToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={24}
                color={isWishlisted ? '#e91e63' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* THREE THUMBNAILS BELOW (dummy/default if image not there) */}
        <View style={styles.thumbRow}>
          {thumbUrls.map((uri, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.thumbWrap, activeImg === i && styles.thumbActiveWrap]}
              onPress={() => setActiveImg(Math.min(i, gallery.length - 1))}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri }}
                style={styles.thumb}
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
    width,
    height: 280,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  mainImage: {
    width,
    height: 280,
    backgroundColor: '#f5f5f5',
  },
  wishlistOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingRight: 12,
  },
  floatingWishlistBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  thumbWrap: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 80,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbActiveWrap: {
    borderColor: '#96B416',
    borderWidth: 2,
  },
  thumb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
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
