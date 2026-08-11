//
//  ContentView.swift
//  Milliways
//
//  Created by gilm on 05/11/2025.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var orderManager = OrderManager()

    var body: some View {
        WelcomeView(orderManager: orderManager)
    }
}

#Preview {
    ContentView()
}
