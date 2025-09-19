import 'package:flutter/material.dart';

class CheckoutScreen extends StatelessWidget {
  static const routeName = '/checkout';

  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Finalizar Pedido'),
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Text(
            'Tela de checkout em desenvolvimento',
            style: TextStyle(fontSize: 18),
          ),
        ),
      ),
    );
  }
}