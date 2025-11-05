//
//  OrderManager.swift
//  Milliways
//
//  Created by gilm on 05/11/2025.
//

import SwiftUI
import Combine

struct OrderItem: Identifiable {
    let id = UUID()
    let menuItem: MenuItem
    var quantity: Int

    var totalPrice: Double {
        Double(quantity) * menuItem.price
    }
}

class OrderManager: ObservableObject {
    @Published var items: [OrderItem] = []

    var totalPrice: Double {
        items.reduce(0) { $0 + $1.totalPrice }
    }

    var totalQuantity: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    func addItem(_ item: MenuItem, quantity: Int) {
        items.append(OrderItem(menuItem: item, quantity: quantity))
    }

    func removeItem(at index: Int) {
        items.remove(at: index)
    }

    func clearOrder() {
        items.removeAll()
    }
}
