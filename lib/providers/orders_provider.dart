import 'package:flutter/foundation.dart';
import '../models/order.dart';

class Orders with ChangeNotifier {
  final List<Order> _orders = [];

  List<Order> get orders {
    return [..._orders];
  }

  void addOrder(List<CartItem> cartProducts, double total) {
    _orders.insert(
      0,
      Order(
        id: DateTime.now().toString(),
        total: total,
        products: cartProducts,
        date: DateTime.now(),
      ),
    );
    notifyListeners();
  }
}