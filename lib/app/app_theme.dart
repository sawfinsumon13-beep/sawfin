import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CasinoColors {
  static const background = Color(0xFF07040D);
  static const surface = Color(0xFF130C1F);
  static const surfaceLight = Color(0xFF241535);
  static const gold = Color(0xFFFFD166);
  static const goldDeep = Color(0xFFC89211);
  static const crimson = Color(0xFFE63946);
  static const emerald = Color(0xFF2DD4BF);
  static const muted = Color(0xFFB8AFC6);
}

class AppTheme {
  static ThemeData dark() {
    final baseTextTheme = GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: CasinoColors.background,
      colorScheme: const ColorScheme.dark(
        primary: CasinoColors.gold,
        secondary: CasinoColors.crimson,
        tertiary: CasinoColors.emerald,
        surface: CasinoColors.surface,
        onPrimary: Color(0xFF1C1200),
        onSurface: Colors.white,
      ),
      textTheme: baseTextTheme.apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
      ),
      cardTheme: CardThemeData(
        color: CasinoColors.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: CasinoColors.gold,
          foregroundColor: const Color(0xFF1C1200),
          minimumSize: const Size.fromHeight(52),
          textStyle: const TextStyle(fontWeight: FontWeight.w800),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: CasinoColors.gold,
          side: const BorderSide(color: CasinoColors.gold),
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: CasinoColors.surfaceLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: const BorderSide(color: CasinoColors.gold, width: 1.4),
        ),
        labelStyle: const TextStyle(color: CasinoColors.muted),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: CasinoColors.surface,
        selectedItemColor: CasinoColors.gold,
        unselectedItemColor: CasinoColors.muted,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
