import 'package:flutter/material.dart';
import '../widgets/category_card.dart';
import '../widgets/product_card.dart';
import '../widgets/cart_badge.dart';
import '../widgets/app_drawer.dart';
import '../providers/products_provider.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  static const routeName = '/home';

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final products = Provider.of<Products>(context).items;
    final featuredProducts = products.take(4).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('SweetDreams'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          const CartBadge(),
        ],
      ),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Categorias',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 120,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: const [
                  CategoryCard(
                    categoryName: 'Chocolates',
                    imageUrl: 'assets/images/chocolates.jpg',
                  ),
                  SizedBox(width: 12),
                  CategoryCard(
                    categoryName: 'Bolos',
                    imageUrl: 'assets/images/bolos.jpg',
                  ),
                  SizedBox(width: 12),
                  CategoryCard(
                    categoryName: 'Balas',
                    imageUrl: 'assets/images/balas.jpg',
                  ),
                  SizedBox(width: 12),
                  CategoryCard(
                    categoryName: 'Sobremesas',
                    imageUrl: 'assets/images/sobremesas.jpg',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Destaques',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.7,
                ),
                itemCount: featuredProducts.length,
                itemBuilder: (ctx, i) => ProductCard(featuredProducts[i]),
              ),
            ),
          ],
        ),
      ),
    );
  }
}