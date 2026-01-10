import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';

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

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const galleryRef = useRef(null);

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
          <Text style={styles.title}>{product.name}</Text>

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
  image: { width, height: 280, resizeMode: 'contain' },
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
  title: { fontSize: 20, fontWeight: '700' },
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
