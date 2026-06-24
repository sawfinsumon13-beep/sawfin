import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../../models/app_user.dart';
import '../../services/admin_repository.dart';
import '../../widgets/casino_widgets.dart';

class AdminUserManagementScreen extends StatefulWidget {
  const AdminUserManagementScreen({super.key});

  @override
  State<AdminUserManagementScreen> createState() => _AdminUserManagementScreenState();
}

class _AdminUserManagementScreenState extends State<AdminUserManagementScreen> {
  final _repository = AdminRepository();
  final _searchController = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          'User Management',
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 8),
        const Text(
          'View, search, edit, suspend, restore, and delete user profiles.',
          style: TextStyle(color: CasinoColors.muted),
        ),
        const SizedBox(height: 18),
        TextField(
          controller: _searchController,
          decoration: const InputDecoration(
            labelText: 'Search users by name, email, role, or status',
            prefixIcon: Icon(Icons.search_rounded),
          ),
          onChanged: (value) => setState(() => _query = value.trim().toLowerCase()),
        ),
        const SizedBox(height: 18),
        StreamBuilder<List<AppUser>>(
          stream: _repository.watchUsers(),
          builder: (context, snapshot) {
            final users = _filter(snapshot.data ?? const <AppUser>[]);
            if (snapshot.connectionState == ConnectionState.waiting && users.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            if (users.isEmpty) {
              return const EmptyState(
                icon: Icons.manage_accounts_rounded,
                title: 'No matching users',
                message: 'Try a different search term.',
              );
            }
            return Column(
              children: [
                for (final user in users)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _UserAdminCard(
                      user: user,
                      onEdit: () => _showEditUserDialog(user),
                      onSuspend: () => _changeStatus(user, user.isSuspended ? 'active' : 'suspended'),
                      onDelete: () => _confirmDelete(user),
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }

  List<AppUser> _filter(List<AppUser> users) {
    if (_query.isEmpty) {
      return users;
    }
    return users.where((user) {
      final text = '${user.displayName} ${user.email} ${user.status} ${user.isAdmin ? 'admin' : 'player'}'.toLowerCase();
      return text.contains(_query);
    }).toList();
  }

  Future<void> _changeStatus(AppUser user, String status) async {
    await _repository.setUserStatus(user, status);
    if (mounted) {
      _showMessage('${user.displayName} marked $status');
    }
  }

  Future<void> _confirmDelete(AppUser user) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        return AlertDialog(
          title: Text('Delete ${user.displayName}?'),
          content: const Text(
            'This marks the Firestore profile as deleted, blocks app access, and keeps the audit trail. Deleting the Firebase Auth account requires an Admin SDK backend.',
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(dialogContext).pop(false), child: const Text('Cancel')),
            FilledButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: const Text('Delete profile'),
            ),
          ],
        );
      },
    );
    if (confirmed == true) {
      await _repository.setUserStatus(user, 'deleted');
      if (mounted) {
        _showMessage('${user.displayName} marked deleted');
      }
    }
  }

  Future<void> _showEditUserDialog(AppUser user) async {
    final name = TextEditingController(text: user.displayName);
    final balance = TextEditingController(text: '${user.balance}');
    var role = user.isAdmin ? 'admin' : 'player';
    var status = user.status;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text('Edit ${user.displayName}'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(controller: name, decoration: const InputDecoration(labelText: 'Display name')),
                    const SizedBox(height: 12),
                    TextField(
                      controller: balance,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Virtual coin balance'),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: role,
                      decoration: const InputDecoration(labelText: 'Role'),
                      items: const [
                        DropdownMenuItem(value: 'player', child: Text('Player')),
                        DropdownMenuItem(value: 'admin', child: Text('Admin')),
                      ],
                      onChanged: (value) => setState(() => role = value ?? role),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: status,
                      decoration: const InputDecoration(labelText: 'Status'),
                      items: const [
                        DropdownMenuItem(value: 'active', child: Text('Active')),
                        DropdownMenuItem(value: 'suspended', child: Text('Suspended')),
                        DropdownMenuItem(value: 'deleted', child: Text('Deleted')),
                      ],
                      onChanged: (value) => setState(() => status = value ?? status),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.of(dialogContext).pop(), child: const Text('Cancel')),
                FilledButton(
                  onPressed: () async {
                    await _repository.updateUserProfile(
                      user: user,
                      displayName: name.text,
                      balance: int.tryParse(balance.text) ?? user.balance,
                      role: role,
                      status: status,
                    );
                    if (dialogContext.mounted) {
                      Navigator.of(dialogContext).pop();
                    }
                    if (mounted) {
                      _showMessage('User profile updated');
                    }
                  },
                  child: const Text('Save'),
                ),
              ],
            );
          },
        );
      },
    );
    name.dispose();
    balance.dispose();
  }

  void _showMessage(String text) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(text), behavior: SnackBarBehavior.floating),
    );
  }
}

class _UserAdminCard extends StatelessWidget {
  const _UserAdminCard({
    required this.user,
    required this.onEdit,
    required this.onSuspend,
    required this.onDelete,
  });

  final AppUser user;
  final VoidCallback onEdit;
  final VoidCallback onSuspend;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final statusColor = switch (user.status) {
      'active' => CasinoColors.emerald,
      'suspended' => CasinoColors.gold,
      'deleted' => CasinoColors.crimson,
      _ => CasinoColors.muted,
    };

    return CasinoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: statusColor,
                child: Text(
                  user.displayName.trim().isEmpty ? 'U' : user.displayName.trim()[0].toUpperCase(),
                  style: const TextStyle(color: Color(0xFF201300), fontWeight: FontWeight.w900),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.displayName, style: const TextStyle(fontWeight: FontWeight.w900)),
                    Text(user.email, style: const TextStyle(color: CasinoColors.muted)),
                  ],
                ),
              ),
              Chip(
                label: Text(user.status),
                backgroundColor: statusColor.withValues(alpha: .18),
                side: BorderSide(color: statusColor),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 14,
            runSpacing: 8,
            children: [
              _MiniStat(label: 'Role', value: user.isAdmin ? 'Admin' : 'Player'),
              _MiniStat(label: 'Coins', value: '${user.balance}'),
              _MiniStat(label: 'XP', value: '${user.xp}'),
              _MiniStat(label: 'Rank', value: user.rank),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onEdit,
                  icon: const Icon(Icons.edit_rounded),
                  label: const Text('Edit'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: user.isDeleted ? null : onSuspend,
                  icon: Icon(user.isSuspended ? Icons.check_circle_rounded : Icons.block_rounded),
                  label: Text(user.isSuspended ? 'Restore' : 'Suspend'),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                onPressed: user.isDeleted ? null : onDelete,
                icon: const Icon(Icons.delete_rounded),
                tooltip: 'Delete profile',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.w900)),
        Text(label, style: const TextStyle(color: CasinoColors.muted, fontSize: 12)),
      ],
    );
  }
}
