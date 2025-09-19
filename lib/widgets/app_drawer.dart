import 'package:flutter/material.dart';
import '../screens/home_screen.dart';
import '../screens/orders_screen.dart';
import '../screens/favorites_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          AppBar(
            title: const Text('SweetDreams'),
            automaticallyImplyLeading: false,
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Início'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed(HomeScreen.routeName);
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.shopping_bag),
            title: const Text('Meus Pedidos'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed(OrdersScreen.routeName);
            },
          ),
          ListTile(
            leading: const Icon(Icons.favorite),
            title: const Text('Favoritos'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed(FavoritesScreen.routeName);
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.exit_to_app),
            title: const Text('Sair'),
            onTap: () {
              // Implementar lógica de logout
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
    );
  }
}