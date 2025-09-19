import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './providers/products_provider.dart';
import './providers/cart_provider.dart';
import './providers/orders_provider.dart';
import './screens/home_screen.dart';
import './screens/product_list_screen.dart';
import './screens/product_detail_screen.dart';
import './screens/cart_screen.dart';
import './screens/checkout_screen.dart';
import './screens/orders_screen.dart';
import './screens/favorites_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (ctx) => Products()),
        ChangeNotifierProvider(create: (ctx) => CartProvider()),
        ChangeNotifierProvider(create: (ctx) => Orders()),
      ],
      child: MaterialApp(
        title: 'SweetDreams',
        theme: ThemeData(
          primarySwatch: Colors.pink,
          colorScheme: ColorScheme.fromSwatch(
            primarySwatch: Colors.pink,
            accentColor: Colors.amber,
          ),
          fontFamily: 'Lato',
          textTheme: const TextTheme(
            headline6: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.pink,
            ),
          ),
        ),
        home: const HomeScreen(),
        routes: {
          ProductListScreen.routeName: (ctx) => const ProductListScreen(category: ''),
          ProductDetailScreen.routeName: (ctx) => const ProductDetailScreen(product: null),
          CartScreen.routeName: (ctx) => const CartScreen(),
          CheckoutScreen.routeName: (ctx) => const CheckoutScreen(),
          OrdersScreen.routeName: (ctx) => const OrdersScreen(),
          FavoritesScreen.routeName: (ctx) => const FavoritesScreen(),
        },
      ),
    );
  }
}