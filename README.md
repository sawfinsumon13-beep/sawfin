# sawfin777

Mobile-first Flutter casino-style entertainment demo with Firebase Authentication
and Cloud Firestore. The app uses **virtual coins only**. There is no real-money
gambling, betting, deposit, withdrawal, bkash, roket, nogot, or cryptocurrency
integration.

## Features

- Firebase email/password registration and login
- Profile page with rank, XP, virtual coin balance, streak, and achievements
- Daily bonus with streak rewards
- Virtual reward catalog and redemption requests
- Leaderboard ranked by XP
- Premium dark casino theme with gold accents and smooth transitions
- Games:
  - Slot Machine
  - Lucky Wheel
  - Card Matching Game
  - Dice Game
  - Coin Flip
- Admin console:
  - Secure admin login with Firebase Authentication
  - Role-based access control using `users/{uid}.role == "admin"`
  - Dashboard metrics for total users, active users, new registrations, and game statistics
  - User management with search, profile edits, suspend/restore, and deleted-status actions
  - Content management for banners, announcements, and notifications
  - Game settings for enable/disable, reward multipliers, and difficulty levels
  - Virtual reward configuration
  - Reports for user activity, game usage, reward distribution, and admin activity logs
- Firestore security rules for authenticated users and admin-only management

## Project structure

```text
lib/
  app/                 Theme, routes, app shell
  models/              Firestore models
  screens/             Splash, auth, dashboard, games, rewards, leaderboard, profile, settings, admin
  services/            Firebase Auth, Firestore repository, game engine
  widgets/             Reusable casino UI widgets
firestore.rules        Firestore authorization rules
firebase.json          Firebase rules configuration
web/                   Flutter web bootstrap files
test/                  Focused unit tests
```

## Prerequisites

- Flutter SDK 3.35 or newer
- Dart 3.9 or newer
- Firebase CLI
- A Firebase project with:
  - Authentication -> Email/Password provider enabled
  - Cloud Firestore created in production mode

## Install

```bash
flutter pub get
```

If your checkout does not include native runner folders for the platforms you
want to ship, generate them with Flutter:

```bash
flutter create . --platforms=android,ios,web
```

The generated platform folders can coexist with the existing `lib/`, `web/`,
`pubspec.yaml`, and Firebase files.

## Firebase configuration

This repository does not commit Firebase secrets or downloaded platform config
files. The app reads Firebase options from `--dart-define` values in
`lib/firebase_options.dart`.

Example web run:

```bash
flutter run -d chrome \
  --dart-define=FIREBASE_WEB_API_KEY=your-web-api-key \
  --dart-define=FIREBASE_WEB_APP_ID=your-web-app-id \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID=your-sender-id \
  --dart-define=FIREBASE_PROJECT_ID=your-project-id \
  --dart-define=FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com \
  --dart-define=FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

Example Android run:

```bash
flutter run -d android \
  --dart-define=FIREBASE_ANDROID_API_KEY=your-android-api-key \
  --dart-define=FIREBASE_ANDROID_APP_ID=your-android-app-id \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID=your-sender-id \
  --dart-define=FIREBASE_PROJECT_ID=your-project-id \
  --dart-define=FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## Build Android APK with GitHub Actions

This repository includes `.github/workflows/build-android-apk.yml` to generate a
downloadable install-ready Android APK from GitHub.

1. Add these repository secrets:
   - `FIREBASE_ANDROID_API_KEY`
   - `FIREBASE_ANDROID_APP_ID`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
2. Open GitHub -> Actions -> Build Android APK.
3. Click **Run workflow**.
4. Download the `sawfin777-demo-install-ready-apk` artifact.

The workflow generates the Android runner with
`flutter create . --platforms=android --org com.sawfin` and uploads
`sawfin777-demo-install-ready.apk`.

By default this workflow builds with `FORCE_OFFLINE_DEMO=true`, so the APK opens
the complete offline demo immediately even if Firebase secrets are not set. For
a live Firebase-backed production build, remove that dart define and provide the
Firebase secrets above.

You may also run `flutterfire configure` and replace `lib/firebase_options.dart`
with the generated file if your team prefers the FlutterFire workflow.

## Deploy Firestore rules

```bash
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

## Create the first admin

1. Register normally inside the app.
2. Open Firestore Console -> `users/{yourUid}`.
3. Change `role` from `player` to `admin`.
4. Return to the app and open Profile -> Admin Console.

Only active administrators can access the control panel. Admin logins and
privileged writes are recorded in `adminActivityLogs`.

## Admin control panel collections

The admin panel uses these Firestore collections:

- `users` - player/admin profiles, account status, virtual balances, activity
- `banners` - active dashboard banner cards
- `announcements` - dashboard announcements
- `notifications` - in-app notification records
- `rewards` - virtual reward catalog
- `gameConfigs` - game enable/disable state, reward multiplier, difficulty
- `gameSessions` - gameplay usage reports
- `rewardRedemptions` - reward distribution reports
- `coinLedger` - virtual coin audit trail
- `adminActivityLogs` - admin login and privileged action audit trail

The client can mark profiles as `suspended` or `deleted` to block app access
while preserving audit history. Deleting Firebase Authentication users requires
a trusted Admin SDK backend such as Cloud Functions; it should not be performed
directly from the Flutter client.

## Seed optional demo content

Create documents in `rewards`:

```json
{
  "title": "Gold Avatar Frame",
  "description": "Cosmetic profile badge for demo players.",
  "cost": 500,
  "stock": -1,
  "active": true
}
```

Create documents in `announcements`:

```json
{
  "title": "Welcome Bonus",
  "body": "Claim your daily virtual coin bonus and try the Lucky Wheel.",
  "active": true,
  "createdAt": "server timestamp"
}
```

You can also create and edit these from the Admin Console after promoting an
admin account.

## Quality checks

```bash
flutter analyze
flutter test
```

## Demo-only policy

All balances, rewards, games, ranks, and achievements are virtual entertainment
features. They cannot be sold, transferred, deposited, withdrawn, exchanged for
money, or connected to payment/crypto systems. For adversarial production
deployments, move game outcome generation into trusted server-side code such as
Cloud Functions to prevent client tampering.
