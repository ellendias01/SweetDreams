import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../widgets/product_card.dart';
import '../providers/products_provider.dart';

class FavoritesScreen extends StatelessWidget {
  static const routeName = '/favorites';

  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final favoriteProducts = Provider.of<Products>(context).favoriteItems;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Favoritos'),
      ),
      body: favoriteProducts.isEmpty
          ? const Center(
              child: Text('Nenhum produto favoritado ainda!'),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.7,
                ),
                itemCount: favoriteProducts.length,
                itemBuilder: (ctx, i) => ProductCard(favoriteProducts[i]),
              ),
            ),
    );
  }
}