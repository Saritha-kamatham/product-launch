# AeroSound Pro | Responsive Product Landing Page

A premium, modern, and fully responsive Product Landing Page for a high-end active noise-cancelling headphone brand (**AeroSound Pro**). Built using semantic HTML5, custom CSS3 variable styling (Flexbox & Grid), and pure vanilla JavaScript (ES6).

## Features

### 🌟 Key Sections
- **Loader Screen:** Custom full-screen loading spinner that fades out cleanly when the window completes loading.
- **Hero Slider:** Autoplay product slider (rotates every 3 seconds) with previous/next triggers and dot indicators. 
- **Sticky Navigation:** Translucent glassmorphic header that locks to the top on scroll, featuring auto-updating active navigation sections (Scroll Spy).
- **Features Grid:** 6 product feature cards featuring interactive hover glows and scaling SVG graphics.
- **Product Gallery:** High-resolution grid cards with zoom effects and a custom JavaScript Lightbox previewer.
- **Statistics Counters:** Dynamic counter bars that count up sequentially from 0 to target metrics as soon as they scroll into view.
- **Pricing Selector:** 3 tiers displaying features and highlighted popular plan. Clicking pricing cards changes selection states and saves selections to local storage.
- **Testimonials:** Elegant reviews showing real client photos, star counts, and detailed feedback.
- **FAQ Accordion:** Expandable questions block designed to only allow one panel open at any time with height transitions.
- **Newsletter Subscription:** Responsive subscription bar. Employs regex check to validate inputs, caches emails to local storage, and pops success toast notifications.
- **Contact Form:** Message dispatch block with input checks (fields filled, email formats, and 10+ digits phone values). Displays toast alerts upon valid submissions.
- **Floating Controls:** Floating Dark Mode theme selector and Back to Top scroll trigger.

### ⚙️ Local Storage Support
The application remembers the user's settings across reloads:
1. **Dark Mode:** Toggles and persists `light` vs `dark` HTML theme settings.
2. **Newsletter Email:** Pre-fills the newsletter email if the user has subscribed in a previous session.
3. **Selected Pricing Plan:** Highlights and persists the selected pricing plan.

## Folder Structure

```
Product-Landing-Page/
├── index.html          # Semantic HTML markup
├── style.css           # Core styling, layouts, dark/light theme, and animations
├── script.js           # Client-side validation, sliders, observers, and storage caching
├── images/
│   ├── hero.png        # Main floating headphones showcase render
│   ├── product1.png    # Close up detail of earcup cushioning
│   ├── product2.png    # Travel protective case and folded build
│   ├── product3.png    # Headphones positioned on premium wood stand
│   └── users/
│       ├── user1.png   # Avatar profile - Sarah Jenkins
│       ├── user2.png   # Avatar profile - Arjun Mehta
│       └── user3.png   # Avatar profile - David Miller
└── README.md           # Documentation
```

## Technologies Used
- **HTML5:** Semantic elements structure, accessibility tags.
- **CSS3:** Custom Variables, Flexbox, Grid, keyframe animations, responsive media queries, glassmorphism filters.
- **JavaScript (ES6):** Intersection Observers (for Scroll Spy, statistics counters, and scroll reveals), DOM Manipulation, Event Listeners, Local Storage API.
- **Typography:** Inter and Plus Jakarta Sans Google Fonts.
- **Icons:** Custom embedded inline SVGs for rendering resolution-independent vector icons.

## Running Locally
To launch the application locally:
1. Clone or download this project folder.
2. Double-click the `index.html` file to open it in your default web browser (or serve it using a local development server like VS Code Live Server).
