import 'package:flutter/material.dart';

import '../app/app_theme.dart';

class PremiumBackground extends StatelessWidget {
  const PremiumBackground({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF090510),
            Color(0xFF160622),
            Color(0xFF030107),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -90,
            right: -70,
            child: _Glow(color: CasinoColors.gold.withValues(alpha: .24), size: 220),
          ),
          Positioned(
            bottom: -110,
            left: -80,
            child: _Glow(color: CasinoColors.crimson.withValues(alpha: .18), size: 260),
          ),
          child,
        ],
      ),
    );
  }
}

class CasinoCard extends StatelessWidget {
  const CasinoCard({
    required this.child,
    this.padding = const EdgeInsets.all(18),
    this.onTap,
    super.key,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final card = AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      padding: padding,
      decoration: BoxDecoration(
        color: CasinoColors.surface.withValues(alpha: .88),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: CasinoColors.gold.withValues(alpha: .18)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: .35),
            blurRadius: 24,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: child,
    );

    if (onTap == null) {
      return card;
    }
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: card,
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({
    required this.title,
    this.subtitle,
    this.action,
    super.key,
  });

  final String title;
  final String? subtitle;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
              ),
              if (subtitle != null)
                Text(
                  subtitle!,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: CasinoColors.muted),
                ),
            ],
          ),
        ),
        if (action != null) action!,
      ],
    );
  }
}

class CoinBadge extends StatelessWidget {
  const CoinBadge({required this.balance, super.key});

  final int balance;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        gradient: const LinearGradient(colors: [CasinoColors.gold, CasinoColors.goldDeep]),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.monetization_on_rounded, color: Color(0xFF201300), size: 18),
          const SizedBox(width: 6),
          Text(
            '$balance',
            style: const TextStyle(
              color: Color(0xFF201300),
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class EmptyState extends StatelessWidget {
  const EmptyState({
    required this.icon,
    required this.title,
    required this.message,
    super.key,
  });

  final IconData icon;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return CasinoCard(
      child: Column(
        children: [
          Icon(icon, size: 42, color: CasinoColors.gold),
          const SizedBox(height: 12),
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: CasinoColors.muted),
          ),
        ],
      ),
    );
  }
}

class DemoOnlyBanner extends StatelessWidget {
  const DemoOnlyBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return CasinoCard(
      padding: const EdgeInsets.all(14),
      child: Row(
        children: const [
          Icon(Icons.verified_user_rounded, color: CasinoColors.emerald),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Demo entertainment only: virtual coins have no cash value. No deposits, withdrawals, betting, bkash, roket, nogot, or crypto.',
              style: TextStyle(color: CasinoColors.muted, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}

class _Glow extends StatelessWidget {
  const _Glow({required this.color, required this.size});

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: size,
      width: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
        boxShadow: [BoxShadow(color: color, blurRadius: 90, spreadRadius: 30)],
      ),
    );
  }
}
