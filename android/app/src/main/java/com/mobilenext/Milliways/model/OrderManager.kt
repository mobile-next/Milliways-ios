package com.mobilenext.Milliways.model

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.runtime.mutableStateListOf
import java.util.UUID

data class OrderItem(
    val menuItem: MenuItem,
    var quantity: Int,
    val id: String = UUID.randomUUID().toString()
) {
    val totalPrice: Double get() = quantity * menuItem.price
}

class OrderManager {
    val items: SnapshotStateList<OrderItem> = mutableStateListOf()
    var couponDiscount by mutableStateOf(0.0)
        private set
    var appliedCouponCode: String? by mutableStateOf(null)
        private set

    val totalPrice: Double get() = items.sumOf { it.totalPrice }

    // Coupon discount is frozen when applied — does not update if cart changes
    val finalTotal: Double get() = totalPrice - couponDiscount

    val totalQuantity: Int get() = items.sumOf { it.quantity }

    fun addItem(item: MenuItem, quantity: Int) {
        items.add(OrderItem(item, quantity))
    }

    fun removeItem(id: String) {
        items.removeAll { it.id == id }
    }

    fun applyCoupon(code: String): Boolean {
        if (!code.equals("MARVIN", ignoreCase = true)) return false
        couponDiscount = 20.0
        appliedCouponCode = "MARVIN"
        return true
    }

    fun clearOrder() {
        items.clear()
        couponDiscount = 0.0
        appliedCouponCode = null
    }
}
