package com.mobilenext.Milliways.ui.screens

import androidx.compose.ui.graphics.Color
import com.mobilenext.Milliways.R
import com.mobilenext.Milliways.model.MenuItem

data class MenuSection(val title: String, val items: List<MenuItem>)

val mainDishes = listOf(
    MenuItem(name = "Ameglian Major Cow", description = "The finest cut from a cow that wants to be eaten", price = 35.00, color = Color(0xFF8B5A2B), imageRes = R.drawable.steak),
    MenuItem(name = "Green Salad", description = "Fresh greens from the hydroponic gardens of Alpha Centauri", price = 22.00, color = Color(0xFF34C759), imageRes = R.drawable.green_salad),
    MenuItem(name = "Soup of the Day", description = "Today's special soup, ingredients vary by solar system", price = 28.00, color = Color(0xFFFF9500), imageRes = R.drawable.soup),
    MenuItem(name = "Quantum Shrimp Cascade", description = "A bowl of shrimp that exist in multiple flavor states until you take the first bite", price = 38.00, color = Color(0xFFFF2D92), imageRes = R.drawable.shrimp),
    MenuItem(name = "Krikkit Fried Logic", description = "An impossible dish that paradoxically tastes like everything you've ever eaten and nothing at all", price = 40.00, color = Color(0xFF32ADE6), imageRes = R.drawable.fried_logic)
)

val drinks = listOf(
    MenuItem(name = "Pan Galactic Gargle Blaster", description = "Like having your brains smashed out by a slice of lemon wrapped around a large gold brick", price = 5.50, color = Color(0xFFFFCC00), imageRes = R.drawable.pan_galactic_gargle_blaster),
    MenuItem(name = "Water", description = "Pure H2O from Earth's finest springs", price = 3.00, color = Color(0xFF007AFF), imageRes = R.drawable.water),
    MenuItem(name = "Coffee", description = "Hot caffeinated beverage to keep you awake through the apocalypse", price = 4.50, color = Color(0xFF8B5A2B), imageRes = R.drawable.coffee),
    MenuItem(name = "Infinite Improbability Float", description = "Odds of getting the same flavor twice are approximately 1 in 10⁸⁰⁰⁰⁰⁰", price = 6.00, color = Color(0xFFAF52DE), imageRes = R.drawable.infinite_improbability_float),
    MenuItem(name = "Dark Matter Martini", description = "So dense it distorts the glass around it; one sip and your hangover develops before you finish drinking", price = 5.75, color = Color(0xFF000000), imageRes = R.drawable.dark_matter_martini)
)

val menuSections = listOf(
    MenuSection("MAIN DISHES", mainDishes),
    MenuSection("DRINKS", drinks)
)
