import 'package:flutter/material.dart';

class OrdersScreen extends StatelessWidget {
  static const routeName = '/orders';

  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meus Pedidos'),
      ),
      body: const Center(
        child: Text(
          'Histórico de pedidos em desenvolvimento',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}