# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]

### Added
- **Dark Mode & Accent Colors**: Complete theme customization system
  - Light, Dark, and AMOLED (pure black) modes
  - 15 beautiful accent colors (Blue, Purple, Green, Pink, Orange, Red, Teal, Yellow, Indigo, Cyan, Rose, Emerald, Amber, Violet, Lime)
  - System theme detection with manual override options
  - AMOLED mode for OLED displays (battery saving with proper contrast)
  - Persistent theme preferences using AsyncStorage
- **Emoji Reactions System**: Users can now react to confessions with any emoji
  - 5 quick-access emojis (👍❤️😂😢😮) for fast reactions
  - Full emoji picker with 100+ emojis accessible via plus button
  - One reaction per user per confession (can be changed anytime)
  - Reaction counts displayed as interactive bubbles
  - All reactions stored in new `reactions` table
- **Collapsible Reactions Panel**: Clean UI with toggle button
  - "React" button in bottom-right corner of each confession
  - Smooth expand/collapse animation with chevron icon
  - Auto-closes after selecting a reaction
  - Only one panel open at a time
- **Upvote System**: Traditional upvoting restored alongside reactions
  - Upvote arrow with count on left side of confessions
  - Orange highlight for active upvotes
  - Independent from emoji reactions system

### Changed
- **Write Screen Button**: Fixed disabled button styling for better visibility across all themes
- Refactored feed UI to support both upvotes and reactions
- Improved confession card layout for better content visibility
- Updated database queries to fetch upvote counts dynamically
- Enhanced theme system with proper contrast ratios for accessibility

### Technical
- Added `reactions` table to Supabase schema
- Implemented comprehensive theme system with React Context
- Added AsyncStorage for theme persistence across app sessions
- Added modal component for emoji picker
- Implemented optimistic UI updates for both upvotes and reactions
- Added proper AMOLED mode support with battery-optimized pure black backgrounds
