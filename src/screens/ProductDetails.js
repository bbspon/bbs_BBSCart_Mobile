import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';

const { width, height } = Dimensions.get('window');

// ------------------------------
// Mock product (replace with real data from your API)
// ------------------------------
const mockProduct = {
  id: 1,
  name: 'Banana ',
  brand: 'Fruitify',
  price: 499,
  mrp: 699,
  discountLabel: '29% off',
  description:
    'Banana Pro Max brings you a-peel-ing performance with a sweet 108MP camera, juicy battery life, and a smooth 120Hz display. Packed with Vitamin UI and potassium-powered AI.',
  images: [
    'https://static.vecteezy.com/system/resources/previews/009/877/200/large_2x/bunch-of-fresh-banana-isolated-on-white-background-with-clipping-path-png.png',
    'https://img.freepik.com/premium-photo/banana-crate_985046-6267.jpg?w=2000',
    'https://static.vecteezy.com/system/resources/thumbnails/033/231/699/small_2x/ai-generative-banana-fruit-fresh-bananas-yellow-banana-png.png',
    'https://www.freepnglogos.com/uploads/banana-png/fresh-ripe-banana-png-image-pngpix-3.png',
  ],
  rating: 4.3,
  ratingCount: 1243,
  reviewCount: 328,
  highlights: [
    '8 GB RAM | 128 GB ROM',
    '6.7" 120Hz AMOLED Display',
    '108MP + 12MP + 5MP | 32MP Front Camera',
    '5000 mAh Battery | 67W Fast Charging',
    'K^+ AI Processor',
  ],
  details: {
    InTheBox: 'Handset, USB-C Cable, SIM Ejector, Quick Guide, TPU Case',
    ModelNumber: 'BANANA-PM-128',
    ModelName: 'Banana Pro Max',
    Color: 'Yellow',
    SIMType: 'Dual SIM, 5G',
    Display: '6.7 inch FHD+ 120Hz AMOLED',
    OS: 'Vitamin UI 2.0 (Android 14)',
    Processor: 'K+ AI Octa-Core',
    Battery: '5000 mAh',
    Warranty: '1 Year on Handset & 6 Months on Accessories',
  },
  policies: {
    cod: true,
    returnsDays: 7,
    warranty: '1 Year Warranty',
  },
  offers: [
    'Bank Offer: 10% Instant Discount on BSS Bank Cards',
    'Exchange Offer: Up to ₹12,000 off on exchange',
    'No Cost EMI from ₹2,083/month',
  ],
};

// Similar products (mock)
const mockSimilar = [
  {
    id: 2,
    name: 'Banana Mini (Yellow, 64 GB)',
    image:
      'https://cdn-prd-02.pnp.co.za/sys-master/images/h9a/hf7/11302864748574/silo-product-image-v2-13Nov2023-165134-6001007291778-Angle_D-189027-672_400Wx400H',
    price: 29999,
    mrp: 39999,
    rating: 4.1,
  },
  {
    id: 3,
    name: 'Banana Ultra (Yellow, 256 GB)',
    image:
      'https://th.bing.com/th/id/R.101bf86da260ff1a2a42cce9008c6c20?rik=8NVI60cLXJ1Bag&riu=http%3a%2f%2fwww.sosweetshop.co.uk%2fcdn%2fshop%2ffiles%2fcarletti-chocolate-foam-bananas-box-box-of-30-724064.png%3fcrop%3dcenter%26height%3d1200%26v%3d1711369023%26width%3d1200&ehk=Mui6dhkirbMbuB5bgSvxQ7ouPsAFFO%2fb2Wrvq1oLB7Y%3d&risl=&pid=ImgRaw&r=0',
    price: 59999,
    mrp: 79999,
    rating: 4.5,
  },
  {
    id: 4,
    name: 'Plantain Plus (Green, 128 GB)',
    image:
      'https://static.vecteezy.com/system/resources/previews/011/653/848/original/fresh-banana-slices-png.png',
    price: 44999,
    mrp: 54999,
    rating: 4.0,
  },
];

// Mock reviews (replace with your API data)
const mockReviews = [
  {
    id: 'r1',
    user: 'Anita',
    rating: 5,
    title: 'Simply superb! 🍌',
    text: 'Camera is crisp, battery easily lasts a day. Display is gorgeous.',
    date: '2025-07-10',
  },
  {
    id: 'r2',
    user: 'Rahul',
    rating: 4,
    title: 'Great value',
    text: 'Performance is smooth. Packaging and delivery were on point.',
    date: '2025-06-28',
  },
  {
    id: 'r3',
    user: 'Sara',
    rating: 3,
    title: 'Good but slippery',
    text: 'Phone is fast but case is a must. Slips easily without it.',
    date: '2025-05-21',
  },
];

const currency = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;

const StarRow = ({ value, size = 16 }) => {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const total = 5;
  const stars = [];
  for (let i = 0; i < total; i++) {
    if (i < full) stars.push('★');
    else if (i === full && hasHalf) stars.push('☆');
    else stars.push('☆');
  }
  return (
    <Text style={{ fontSize: size, letterSpacing: 1 }}>{stars.join(' ')}</Text>
  );
};

const ProductDetails = ({ route }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const product = route?.params?.product || mockProduct;
  const similar = route?.params?.similar || mockSimilar;
  const reviews = route?.params?.reviews || mockReviews;

  const [activeIndex, setActiveIndex] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  const galleryRef = useRef(null);

  const youSave = useMemo(() => {
    const mrp = product.mrp || product.price;
    const save = Math.max(0, (mrp || 0) - (product.price || 0));
    return save;
  }, [product]);

  const discountPercent = useMemo(() => {
    const mrp = product.mrp || product.price;
    if (!mrp) return 0;
    return Math.round(((mrp - product.price) / mrp) * 100);
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigation.navigate('Checkout');
  };

  const handleChangeAddress = () => {
    // Direct user to app Settings / Address screen
    navigation.navigate('Settings');
  };

  const onPressThumb = (index) => {
    setActiveIndex(index);
    galleryRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const renderSimilarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.similarCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.similarImage} />
      <Text style={styles.similarName} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={styles.similarPrice}>{currency(item.price)}</Text>
        {item.mrp ? (
          <Text style={styles.similarMrp}>{currency(item.mrp)}</Text>
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <StarRow value={item.rating || 0} size={12} />
        <Text style={styles.similarRating}>{item.rating?.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7f9' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image Gallery */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={galleryRef}
            onScroll={(e) => {
              const idx = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(idx);
            }}
            scrollEventThrottle={16}
          >
            {(product.images?.length ? product.images : [product.image]).map(
              (img, i) => (
                <Image key={i} source={{ uri: img }} style={styles.productImage} />
              )
            )}
          </ScrollView>
          {/* Thumbnails */}
          <View style={styles.thumbRow}>
            {(product.images?.length ? product.images : [product.image]).map(
              (img, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => onPressThumb(i)}
                  style={[
                    styles.thumbnailWrap,
                    activeIndex === i && styles.thumbnailActive,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbnail} />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Title & Ratings */}
        <View style={styles.detailsCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StarRow value={product.rating || 0} />
              <Text style={styles.ratingText}>
                {product.rating?.toFixed(1)} ({product.ratingCount?.toLocaleString('en-IN')} ratings)
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.ratingText}>
                {product.reviewCount?.toLocaleString('en-IN')} reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Price & Offers */}
        <View style={styles.detailsCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{currency(product.price)}</Text>
            {product.mrp && product.mrp !== product.price ? (
              <Text style={styles.mrp}>{currency(product.mrp)}</Text>
            ) : null}
            {discountPercent > 0 ? (
              <Text style={styles.discount}>{discountPercent}% off</Text>
            ) : null}
          </View>
          {youSave > 0 ? (
            <Text style={styles.youSave}>You save {currency(youSave)}</Text>
          ) : null}

          {/* Offer bullets */}
          {product.offers?.length ? (
            <View style={{ marginTop: 12 }}>
              {product.offers.map((o, idx) => (
                <View key={idx} style={styles.offerItem}>
                  <Text style={styles.offerBullet}>•</Text>
                  <Text style={styles.offerText}>{o}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Delivery Address */}
        <View style={styles.detailsCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Delivery</Text>
            <TouchableOpacity onPress={handleChangeAddress}>
              <Text style={styles.linkText}>Change address in Settings ›</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.deliveryLine}>Deliver to: Your saved address</Text>
          <Text style={styles.deliveryEta}>Estimated delivery: 2–4 days</Text>
        </View>

        {/* Policies (COD / Returns) */}
        <View style={[styles.detailsCard, styles.chipsRow]}>
          {product.policies?.cod ? (
            <View style={styles.chip}><Text style={styles.chipText}>Cash on Delivery</Text></View>
          ) : null}
          {product.policies?.returnsDays ? (
            <View style={styles.chip}><Text style={styles.chipText}>{product.policies.returnsDays}-Day Returns</Text></View>
          ) : null}
          {product.policies?.warranty ? (
            <View style={styles.chip}><Text style={styles.chipText}>{product.policies.warranty}</Text></View>
          ) : null}
        </View>

        {/* Highlights */}
        {product.highlights?.length ? (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {product.highlights.map((h, i) => (
              <View key={i} style={styles.highlightItem}>
                <Text style={styles.offerBullet}>•</Text>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Description */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Specifications (collapsible) */}
        <View style={styles.detailsCard}>
          <TouchableOpacity onPress={() => setSpecsOpen((v) => !v)} style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <Text style={styles.linkText}>{specsOpen ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
          {specsOpen ? (
            <View style={{ marginTop: 8 }}>
              {Object.entries(product.details || {}).map(([key, val]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specVal}>{String(val)}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Customer Reviews */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <View style={styles.reviewSummaryRow}>
            <View style={styles.reviewScoreBox}>
              <Text style={styles.reviewScore}>{product.rating?.toFixed(1)}</Text>
              <StarRow value={product.rating || 0} />
              <Text style={styles.reviewCountText}>
                {product.ratingCount?.toLocaleString('en-IN')} ratings & {product.reviewCount?.toLocaleString('en-IN')} reviews
              </Text>
            </View>
          </View>

          {reviews.map((r) => (
            <View key={r.id} style={styles.reviewItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.userBadge}><Text style={styles.userBadgeText}>{r.user[0]?.toUpperCase()}</Text></View>
                <Text style={styles.reviewUser}>{r.user}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StarRow value={r.rating} />
                <Text style={styles.reviewTitle}>{r.title}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}

          <TouchableOpacity onPress={() => navigation.navigate('AllReviews', { productId: product.id })}>
            <Text style={styles.linkText}>See all reviews ›</Text>
          </TouchableOpacity>
        </View>

        {/* Similar Products */}
        {similar?.length ? (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Similar Products</Text>
            <FlatList
              horizontal
              data={similar}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderSimilarItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky footer actions */}
      <View style={styles.footerBar}>
        <TouchableOpacity style={[styles.footerBtn, styles.btnOutline]} onPress={handleAddToCart}>
          <Text style={[styles.footerBtnText, styles.btnOutlineText]}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerBtn, styles.btnFill]} onPress={handleBuyNow}>
          <Text style={[styles.footerBtnText, styles.btnFillText]}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CARD_BG = '#ffffff';
const PRIMARY = '#96B416';
const TEXT_DARK = '#23262B';
const TEXT_MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  productImage: {
    width,
    height: height * 0.45,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  thumbRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 10,
  },
  thumbnailWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: PRIMARY,
    borderWidth: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  detailsCard: {
    backgroundColor: CARD_BG,
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  ratingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  dot: { color: TEXT_MUTED },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY,
  },
  mrp: {
    fontSize: 14,
    color: TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
  },
  youSave: {
    marginTop: 4,
    fontSize: 12,
    color: '#065F46',
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  offerBullet: { color: TEXT_MUTED },
  offerText: { flex: 1, color: TEXT_DARK },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  linkText: {
    color: PRIMARY,
    fontWeight: '600',
  },
  deliveryLine: { marginTop: 8, color: TEXT_DARK },
  deliveryEta: { marginTop: 2, color: TEXT_MUTED, fontSize: 12 },

  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipText: { color: TEXT_DARK, fontWeight: '600' },

  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  highlightText: { flex: 1, color: TEXT_DARK },

  description: { marginTop: 6, color: TEXT_DARK, lineHeight: 20 },

  specRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  specKey: { width: 120, color: TEXT_MUTED },
  specVal: { flex: 1, color: TEXT_DARK },

  reviewSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  reviewScoreBox: { alignItems: 'flex-start', gap: 4 },
  reviewScore: { fontSize: 28, fontWeight: '800', color: TEXT_DARK },
  reviewCountText: { color: TEXT_MUTED, marginTop: 2 },

  reviewItem: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
  },
  userBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E9F5D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBadgeText: { color: PRIMARY, fontWeight: '800' },
  reviewUser: { fontWeight: '700', color: TEXT_DARK },
  reviewDate: { color: TEXT_MUTED },
  reviewTitle: { fontWeight: '700', color: TEXT_DARK },
  reviewText: { marginTop: 6, color: TEXT_DARK, lineHeight: 20 },

  similarCard: {
    width: 160,
    backgroundColor: '#fff',
    marginRight: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    overflow: 'hidden',
  },
  similarImage: { width: '100%', height: 120, resizeMode: 'cover' },
  similarName: { padding: 8, paddingBottom: 0, fontSize: 14, color: TEXT_DARK },
  similarPrice: { paddingLeft: 8, fontWeight: '700', color: PRIMARY },
  similarMrp: {
    fontSize: 12,
    color: TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  similarRating: { fontSize: 12, color: TEXT_MUTED },

  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#ffffffee',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  btnOutlineText: { color: PRIMARY, fontWeight: '800' },
  btnFill: { backgroundColor: PRIMARY },
  btnFillText: { color: '#fff', fontWeight: '800' },
  footerBtnText: { fontSize: 16 },
});

export default ProductDetails;
