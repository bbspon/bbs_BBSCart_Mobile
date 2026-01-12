import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator,
    Animated, ScrollView, Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 180;

// ---------------- Mock Product Data ----------------
const productData = [
    {
        id: '1',
        name: 'Organic Apples',
        category: 'Groceries',
        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
        priceOptions: [
            { quantity: '500g', price: 120 },
            { quantity: '1kg', price: 220 },
        ],
    },
    {
        id: '2',
        name: 'Fresh Bananas',
        category: 'Groceries',
        image: 'https://static.vecteezy.com/system/resources/previews/009/877/200/large_2x/bunch-of-fresh-banana-isolated-on-white-background-with-clipping-path-png.png',
        priceOptions: [
            { quantity: '6 pcs', price: 60 },
            { quantity: '12 pcs', price: 110 },
        ],
    },
    {
        id: '3',
        name: 'Basmati Rice',
        category: 'Groceries',
        image: 'https://images.rawpixel.com/image_png_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3Jhd3BpeGVsX29mZmljZV80M19hX2Nsb3NlLXVwX3Nob3RfcGhvdG9zaG9vdF9vZl9hX2Jhc21hdGlfcmljZV9jNDMxM2Q1OS03NjFlLTQ5OTQtODJmMi1jNTZhNmVlNzEzZjEucG5n.png',
        priceOptions: [
            { quantity: '1kg', price: 150 },
            { quantity: '5kg', price: 700 },
        ],
    },
    {
        id: '4',
        name: 'Whole Wheat Flour',
        category: 'Groceries',
        image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f',
        priceOptions: [
            { quantity: '1kg', price: 45 },
            { quantity: '5kg', price: 210 },
        ],
    },
    {
        id: '5',
        name: 'Samsung Galaxy S22',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1646073752268-6a52aca5f05d',
        priceOptions: [
            { size: '128GB', price: 62000 },
            { size: '256GB', price: 68000 },
        ],
    },
    {
        id: '6',
        name: 'Sony WH-1000XM4 Headphones',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1618365908648-9a09e843637c',
        priceOptions: [
            { size: 'Standard', price: 24990 },
        ],
    },
    {
        id: '7',
        name: 'Dell XPS 13 Laptop',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        priceOptions: [
            { size: '8GB RAM / 256GB SSD', price: 95000 },
            { size: '16GB RAM / 512GB SSD', price: 125000 },
        ],
    },
    {
        id: '8',
        name: 'Nike Running Shoes',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1600180758895-57a9e2c46d4d',
        priceOptions: [
            { size: 'UK 7', price: 3999 },
            { size: 'UK 8', price: 4199 },
            { size: 'UK 9', price: 4399 },
        ],
    },
    {
        id: '9',
        name: 'Men’s Casual T-Shirt',
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
        priceOptions: [
            { size: 'M', price: 699 },
            { size: 'L', price: 749 },
            { size: 'XL', price: 799 },
        ],
    },
    {
        id: '10',
        name: 'LED Smart TV 43”',
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
        priceOptions: [
            { size: '43-inch', price: 28000 },
            { size: '55-inch', price: 42000 },
        ],
    },
];

// ---------------- Hero Banner ----------------
const heroBannerImages = [
    { id: '1', image: require('../assets/images/Banner_1.png'), title: 'Super Sale!' },
    { id: '2', image: require('../assets/images/Banner_2.png'), title: 'Latest Gadgets' },
    { id: '3', image: require('../assets/images/Banner_3.png'), title: 'Fashion Deals' },
];

const ProductListings = () => {
    const { addToCart } = useCart();
    const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
    const [selectedQuantity, setSelectedQuantity] = useState({});
    const [productQuantities, setProductQuantities] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allProductsLoaded, setAllProductsLoaded] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (currentIndex + 1) % heroBannerImages.length;
            setCurrentIndex(nextIndex);
            scrollViewRef.current?.scrollTo({
                x: width * nextIndex,
                animated: true,
            });
        }, 3000);
        return () => clearInterval(intervalId);
    }, [currentIndex]);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
            listener: (event) => {
                const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
            },
        }
    );

    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    const loadProducts = () => {
        setLoading(true);
        const filteredProducts = productData.filter(product =>
            selectedCategory === 'All' || product.category === selectedCategory
        );
        setProducts(filteredProducts.slice(0, 10));
        setLoading(false);
    };

    const handleLoadMore = () => {
        if (!loading && !allProductsLoaded) {
            setLoading(true);
            const currentLength = products.length;
            const nextProducts = productData.filter(product =>
                selectedCategory === 'All' || product.category === selectedCategory
            ).slice(currentLength, currentLength + 10);

            if (nextProducts.length > 0) {
                setProducts(prev => [...prev, ...nextProducts]);
            } else {
                setAllProductsLoaded(true);
            }
            setLoading(false);
        }
    };

    const renderPagination = () => (
        <View style={styles.pagination}>
            {heroBannerImages.map((_, i) => {
                let opacity = scrollX.interpolate({
                    inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });
                return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
            })}
        </View>
    );

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleAddToCart = (product) => {
        console.log('Added to cart:', product.name);
        navigation.navigate('CartPage', { product });
    };

    const toggleWishlist = async (productId) => {
        // Check if product is already in wishlist
        // Note: ProductListings uses mock data with 'id' field, but API products use '_id'
        // We'll need to check if the productId exists in wishlistItems
        const isWishlisted = wishlistItems.some((item) => {
            const wProductId = item.product?._id || item._id || item.id;
            return wProductId === productId || wProductId?.toString() === productId?.toString();
        });
        
        if (isWishlisted) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const handleViewProduct = (product) => {
        navigation.navigate('ProductDetails', { product });
    };

    const incrementQuantity = (productId) => {
        setProductQuantities((prev) => ({ ...prev, [productId]: (prev[productId] || 1) + 1 }));
    };

    const decrementQuantity = (productId) => {
        setProductQuantities((prev) => ({ ...prev, [productId]: prev[productId] > 1 ? prev[productId] - 1 : 1 }));
    };

    const filteredData = selectedCategory === 'All'
        ? productData
        : productData.filter(product => product.category === selectedCategory);

    const renderProduct = ({ item }) => {
        const currentPriceOption = selectedQuantity[item.id] || item.priceOptions[0];
        const productQuantity = productQuantities[item.id] || 1;
        // Check if product is in wishlist - handle both API products (_id) and mock products (id)
        const isWishlisted = wishlistItems.some((wItem) => {
            const wProductId = wItem.product?._id || wItem._id || wItem.id;
            return wProductId === item.id || wProductId === item._id || wProductId?.toString() === item.id?.toString();
        });

        return (
            <View style={styles.productContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={styles.priceQuantityContainer}>
                        <Text style={styles.productPrice}>
                            ₹{formatPrice(currentPriceOption.price * productQuantity)}
                        </Text>
                        <View style={styles.quantityPickerContainer}>
                            <Text style={styles.quantityText}>Size:</Text>
                            <Picker
                                selectedValue={currentPriceOption.quantity || currentPriceOption.size}
                                style={styles.quantityPicker}
                                onValueChange={(value) =>
                                    setSelectedQuantity((prev) => ({
                                        ...prev,
                                        [item.id]: item.priceOptions.find(
                                            (option) =>
                                                option.quantity === value || option.size === value
                                        ),
                                    }))
                                }
                            >
                                {item.priceOptions.map((option) => (
                                    <Picker.Item
                                        key={option.quantity || option.size}
                                        label={option.quantity || option.size}
                                        value={option.quantity || option.size}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                            <Text style={{ fontSize: 10 }}>➖</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{productQuantity}</Text>
                        <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                            <Text style={{ fontSize: 10 }}>➕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.actionIcons}>
                        <TouchableOpacity onPress={() => toggleWishlist(item.id)}>
                            <Text style={{ fontSize: 15 }}>
                                {isWishlisted ? "❤️" : "🤍"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => handleAddToCart(item)}
                        >
                            <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleViewProduct(item)}>
                            <Text style={{ fontSize: 15 }}>👁️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.heroBanner}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                >
                    {heroBannerImages.map((item) => (
                        <View key={item.id} style={styles.slide}>
                            <Image source={item.image} style={styles.bannerImage} />
                        </View>
                    ))}
                </ScrollView>
                {renderPagination()}
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterText}>Filter by Category:</Text>
                <Picker
                    selectedValue={selectedCategory}
                    style={styles.categoryPicker}
                    onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                >
                    <Picker.Item label="All" value="All" />
                    <Picker.Item label="Groceries" value="Groceries" />
                    <Picker.Item label="Electronics" value="Electronics" />
                    <Picker.Item label="Fashion" value="Fashion" />
                </Picker>
            </View>

            <Text style={styles.totalProductsText}>
                Total Products: {filteredData.length}
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                    getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                    contentContainerStyle={styles.productList}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    heroBanner: { height: 150, marginBottom: 10 },
    slide: { width, justifyContent: 'center', alignItems: 'center' },
    bannerImage: { width: '100%', height: 200 },
    pagination: { flexDirection: 'row', position: 'absolute', bottom: 10, alignSelf: 'center' },
    dot: { height: 10, width: 10, backgroundColor: '#fff', borderRadius: 5, marginHorizontal: 8 },
    filterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: '#fff' },
    filterText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    categoryPicker: { height: 50, width: 150 },
    totalProductsText: { fontSize: 14, marginTop: 5, marginRight: 15, textAlign: 'right', color: '#666' },
    productList: { padding: 10 },
    productContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    productImage: { width: 80, height: 80, borderRadius: 8 },
    productDetails: { flex: 1, paddingLeft: 10 },
    productName: { fontSize: 16, fontWeight: 'bold', marginBottom: -10, color: '#697e0f' },
    priceQuantityContainer: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: -8 },
    productPrice: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    quantityPickerContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityText: { fontSize: 14 },
    quantityPicker: { width: 150 },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: '#cbda8b',
        borderRadius: 10,
    },
    quantityValue: { fontSize: 16, marginHorizontal: 10 },
    actionIcons: { flexDirection: 'row', alignItems: 'center', gap: 25, marginTop: 10 },
    addToCartButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#cbda8b', borderRadius: 5 },
    addToCartText: { color: '#5a6c0d', marginLeft: 5, fontWeight: 'bold' },
});

export default ProductListings;
