# SkillSync Mobile - Main Mobile Client

A modern, responsive, and cross-platform mobile application for the SkillSync Job Board platform, built with React Native, Expo, and NativeWind (Tailwind CSS).

## Overview

The SkillSync Mobile client serves as the primary native interface for both job seekers (Applicants) and employers (Recruiters). It delivers a seamless mobile experience for browsing vacancies, discovering talent, managing company profiles, handling job applications, and communicating in real-time. Built with Expo Router for intuitive file-based navigation, the application connects directly with the SkillSync microservices ecosystem.

## Features

- **Role-Based Dashboards**: Dedicated interfaces, navigation tabs, and actions tailored for both `APPLICANT` and `EMPLOYER` roles.
- **Real-time Chat**: Integrated WebSocket communication via Socket.io for instant messaging between recruiters and candidates with live typing indicators and unread counters.
- **AI-Powered Tools**: Integration with the AI service to generate tailored cover letters and evaluate candidate-vacancy match scores using token-based billing.
- **Advanced Filtering & Search**: Comprehensive search for vacancies and candidates using debounced queries and multi-select filter sheets (skills, categories, employment types, experience levels).
- **Secure Keychain Authentication**: Token-based authentication using `expo-secure-store` for encrypted storage of access & refresh tokens with automatic session renewal.
- **Modern UI/UX**: Fluid native interface built with NativeWind (Tailwind CSS), dark/light theme switching (`useThemeStore`), and cross-platform touch optimizations.
- **Form Validation**: Robust client-side validation using `react-hook-form` and `zod`.
- **Interactive Toast Notifications**: Non-intrusive in-app toast notification system for instant feedback on network actions, successes, and errors.

## Tech Stack

| Technology                   | Purpose                    |
| ---------------------------- | -------------------------- |
| React Native & Expo (SDK 57) | Framework & Native Runtime |
| Expo Router                  | File-based Routing         |
| TypeScript                   | Language                   |
| NativeWind (Tailwind CSS v4) | Mobile Styling             |
| Zustand                      | Global State Management    |
| React Hook Form + Zod        | State & Validation         |
| Socket.io Client             | Real-time Communication    |
| Expo SecureStore             | Encrypted Token Storage    |

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo Go app on a physical device ([iOS App Store](https://apps.apple.com/app/expo-go/id982107779) / [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)), or Xcode / Android Studio for local simulator/emulator development
- Running instances of SkillSync Backend services (Core Gateway, Auth, AI, Chat, Payment)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mildoss/skillsync-mobile.git
cd skillsync-mobile
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# SkillSync REST API Gateway URL
EXPO_PUBLIC_API_URL=YOUR_API_GATEWAY

# SkillSync WebSocket / Chat Gateway URL
EXPO_PUBLIC_SOCKET_URL=YOUR_SOCKET_URL
```

> For local development, you can replace the URLs with your local machine's IP address (e.g. `http://192.168.1.X:3000`). Avoid using `localhost` when testing on physical mobile devices.

## Usage

### Development

Start the Expo development server:

```bash
npm run start
```

Or start with a clean cache:

```bash
npx expo start -c
```

Target controls:

- Press `a` in the terminal to launch the Android Emulator.
- Press `i` in the terminal to launch the iOS Simulator.
- Press `w` in the terminal for Web preview.
- Scan the QR code with Expo Go (Android) or Camera (iOS) to test on a physical device.

### Production Build

Generate standalone production binaries (`.apk`, `.aab`, `.ipa`) using [EAS Build](https://docs.expo.dev/build/introduction/):

1. Install EAS CLI and authenticate:

```bash
npm install -g eas-cli
eas login
```

2. Configure EAS in the project:

```bash
eas build:configure
```

3. Trigger a platform build:

```bash
# Build Android APK (Preview)
eas build --platform android --profile preview

# Build iOS IPA (Preview)
eas build --platform ios --profile preview
```

## Project Structure

```
.
├── app/                  # Expo Router file-based route hierarchy
│   ├── (tabs)/           # Main bottom tab navigator (vacancies, candidates, companies, profile)
│   ├── candidates/       # Candidate detail view & filter sheets
│   ├── chats/            # Real-time chat list & conversation windows
│   ├── companies/        # Company details view
│   ├── vacancies/        # Vacancy details view & filter sheets
│   ├── _layout.tsx       # Root layout with Toast, Theme, & Auth providers
│   └── index.tsx         # Launch routing & authentication flow
├── components/           # Modular React Native components
│   ├── applications/     # Application cards, cover letter previews, evaluator modals
│   ├── auth/             # Login and Registration form components
│   ├── candidates/       # Candidate listing cards & skeleton loaders
│   ├── chats/            # Message bubbles, chat counter, input bar
│   ├── companies/        # Company profile headers, danger zone, vacancy forms
│   ├── notifications/    # Notification bell & modal sheet
│   ├── profile/          # Profile forms, billing & application management tabs
│   ├── shared/           # CustomAvatar, SearchHeader, ImageUpload, ThemeToggle
│   └── ui/               # Reusable UI primitives (Button, Input, Select, Checkbox, Badge, Toast)
├── hooks/                # Custom React hooks (useChatSocket, useVacancies, useCandidates, etc.)
├── lib/                  # Utilities, API client, validation schemas, and constants
├── store/                # Zustand global stores (auth, chat, notifications, theme, toast)
└── types/                # TypeScript interfaces (users, vacancies, companies, chat, etc.)
```

## Development Guidelines

- **Native Styling**: Use NativeWind utility classes. Ensure Android-specific styling properties (such as `includeFontPadding: false` and explicit vertical centering) are respected.

- **API Client**: REST calls are centralized in `lib/api/` with automatic Bearer token injection from `lib/storage.ts`.

- **State Management**: Zustand stores in `store/` manage global state (auth session, chat threads, toast notifications, theme).

- **Real-Time Communication**: WebSocket lifecycles are orchestrated through `hooks/useChatSocket.ts` and `store/useChatStore.ts` with automatic reconnection.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/mildoss/skillsync-mobile/issues).

## Related Projects

This is the mobile client for the SkillSync platform ecosystem. Other microservices include:

- [SkillSync Frontend](https://github.com/mildoss/skillsync-frontend)
- [SkillSync Backend - Core Service](https://github.com/mildoss/skillsync-backend)
- [SkillSync Backend - Payment Service](https://github.com/mildoss/skillsync-backend-payment)
- [SkillSync Backend - AI Service](https://github.com/mildoss/skillsync-backend-ai)
- [SkillSync Backend - Auth Service](https://github.com/Eugene-Stellar/SkillSync-auth-service)

---

_Last Updated: 2026-09-20_
