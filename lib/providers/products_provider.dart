import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../data/dummy_data.dart';

class Products with ChangeNotifier {
  List<Product> _items = dummyProducts;

  List<Product> get items {
    return [..._items];
  }

  List<Product> get favoriteItems {
    return _items.where((prod) => prod.isFavorite).toList();
  }

  List<Product> getItemsByCategory(String category) {
    return _items.where((prod) => prod.category == category).toList();
  }

  Product findById(String id) {
    return _items.firstWhere((prod) => prod.id == id);
  }

  void toggleFavorite(String productId) {
    final productIndex = _items.indexWhere((prod) => prod.id == productId);
    if (productIndex >= 0) {
      _items[productIndex] = _items[productIndex].copyWith(
        isFavorite: !_items[productIndex].isFavorite,
      );
      notifyListeners();
    }
  }
}