NEXFLIX (Frontend Training Project)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
A responsive streaming platform UI prototype built iteratively during hands-on training sessions using a modern "Vibecoding" approach—combining rapid AI-assisted ideation, design prototyping, and structured frontend implementation with React, Vite, React Router, Tailwind CSS, and Lucide Icons.

This repository showcases component-driven development, state management, routing, API integration patterns, and resilient fallback systems.

💡 What is Vibecoding Here?
In this training project, Vibecoding refers to flowing with AI assistance to rapidly brainstorm, architect, prompt-engineer, and refine user experiences on the fly. Instead of writing boilerplate manually, sessions focused on:

Translating product vibes (like Netflix's cinematic aesthetic) directly into Tailwind CSS utility layouts.

Rapidly generating robust React hooks, fallback mock structures, and responsive component trees.

Iteratively refining UI states (loading, errors, search debouncing, and video resume trackers) through continuous conversational prototyping.

📚 Training Overview & Methodology
--------------------------------------------------------------------------------------------------------------------------------
Phase 1 - Vibecoding & Layout Setup: Establishing the cinematic streaming look and feel using Tailwind CSS and Lucide icons.

Phase 2 - Routing & Component Architecture: Structuring reusable components (Hero banners, movie rows, cards) and navigating smoothly using React Router.

Phase 3 - State & Local Persistence: Implementing interactive user flows (profile switching, watchlists, preferences) and saving states securely in the browser's LocalStorage.

Phase 4 - API Integration & Fallback Handling: Connecting to external media data sources (TMDB API) while building a robust fallback mock dataset to keep the app functional offline or without API keys.

Core Features & How They Were Built Dynamic Hero & Horizontal Rows:
--------------------------------------------------------------------------------------------------------------------------------
Implementation: React state and array mapping to render featured media highlights, paired with scrollable flex containers for title carousels.

Catalogs, Sorting & Filtering:

Implementation: Multi-parameter filtering logic allowing users to dynamically sort content by genre, release year, ratings, and custom categories.

Debounced Search System:

Implementation: Optimized search inputs using debouncing techniques to prevent excessive re-renders while typing.

Interactive Demo Player & Resume Progress:

Implementation: Custom video player component featuring playback controls, custom overlay handlers, and local timestamp tracking.

User Preferences & "My List":

Implementation: Custom React hooks combined with browser LocalStorage to persist bookmarks, active profiles, and preferences across sessions.

🛠️ Tech Stack
--------------------------------------------------------------------------------------------------------------------------------
Library/Framework: React (Functional components & hooks)

.Bundler: Vite (Fast development & optimized builds)

Routing: React Router

Styling: Tailwind CSS

Icons: Lucide Icons

Linting: Oxlint
