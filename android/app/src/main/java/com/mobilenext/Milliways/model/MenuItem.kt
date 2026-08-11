package com.mobilenext.Milliways.model

import androidx.annotation.DrawableRes
import androidx.compose.ui.graphics.Color
import java.util.UUID

data class MenuItem(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val description: String,
    val price: Double,
    val color: Color,
    @DrawableRes val imageRes: Int? = null
)

fun formatPrice(value: Double): String = "₭%.2f".format(value)
