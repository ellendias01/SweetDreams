import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/product_card.dart';
import '../widgets/cart_badge.dart';
import '../providers/products_provider.dart';

class ProductListScreen extends StatelessWidget {
  static const routeName = '/product-list';
  final String category;

  const ProductListScreen({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    final products = Provider.of<Products>(context).getItemsByCategory(category);

    return Scaffold(
      appBar: AppBar(
        title: Text(category),
        actions: const [CartBadge()],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.7,
          ),
          itemCount: products.length,
          itemBuilder: (ctx, i) => ProductCard(products[i]),
        ),
      ),
    );
  }
}