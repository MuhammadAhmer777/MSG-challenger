# FreshFind — Complete Project Report

## 1. Problem Definition
Farmers-market information is often scattered across flyers, community boards, social media and word of mouth. FreshFind consolidates market locations, operating days/hours and typical seasonal produce into one browser-based tool.

## 2. Proposed Solution
FreshFind is a React Single Page Application (SPA) built with Vite. Market, produce and chatbot information is loaded from pre-populated JSON files. The project has no backend server and the chatbot uses pre-scripted rule-based responses.

## 3. Scope and Users
FreshFind supports residents planning market visits, community organizations promoting local markets and farmers/local sellers seeking a simple digital footprint. The scope covers searchable markets, market detail pages, produce guidance, seasonal recommendations, chatbot support, bookmarks and responsive browsing.

## 4. Design Specifications
### 4.1 Site Map
- Home / Find a Market
- Market Directory
- Market Detail
- Produce Guide
- Bookmarks
- About Us
- Contact Us
- Cross-page floating Chatbot
- Cross-page search/navigation

### 4.2 Home Page
- FreshFind logo, heading and introductory content
- Find a Market search prompt by area, day and produce
- Rotating featured market showcase
- Seasonal produce / this-week recommendations
- Live clock and simulated visitor counter
- Nearby/open-now status with optional browser geolocation
- Floating chatbot

### 4.3 Market Directory
- JSON-powered market catalog
- Market name, area, days/hours, description and thumbnail
- Area, day and produce filters
- Alphabetical, proximity and next-open sorting

### 4.4 Market Detail
- Address and area
- Embedded Google Map
- Weekly schedule table
- Open-now status
- Typical produce grid with images
- Bookmark, session note and share actions
- Breadcrumb navigation

### 4.5 Produce Guide
- Produce catalogue
- Description and typical season
- Category filter
- Search and season filter
- Links/association to markets

### 4.6 Chatbot
- Floating widget available throughout the SPA
- Typed questions and suggested quick replies
- Responses from `data/chatbot.json`
- Relevant navigation links to Market Directory or Produce Guide
- No live AI API or backend

### 4.7 Bookmarking
- Favorite market entries
- Favorite produce entries
- Session-only notes
- Formatted bookmark export
- Web Share / clipboard fallback

### 4.8 Contact Us
- Static contact information
- Google Maps embed
- Browser Geolocation button
- Map updates to the permitted browser location after permission

### 4.9 About Us
- Static platform information
- Project/team context
- Explanation of FreshFind's frontend-only architecture and major features

## 5. Non-Functional Requirements
- **Safe:** no malicious downloads; only user-requested bookmark export is generated.
- **Accessible:** semantic controls, labels, visible keyboard focus, readable typography, alt text and skip-to-content link.
- **User-friendly:** clear navigation, search, filters and breadcrumbs.
- **Operability:** frontend modules are connected through SPA routing and browser APIs.
- **Performance:** static assets and JSON data are separated; lazy map/images are used where appropriate.
- **Capacity:** no application server/database dependency is required for the demo, reducing server-side workload.
- **Availability:** the static project can be served continuously by a suitable static host.
- **Compatibility:** designed for current modern browsers supporting standard HTML/CSS/JavaScript APIs.

## 6. Technical Design
- `index.html` — Vite document shell
- `src/main.jsx` — React root and stylesheet entry
- `src/App.jsx` — React pages, navigation, filters and browser interactions
- `vite.config.js` — Vite React plugin configuration
- `package.json` — project dependencies and development/build scripts
- `style.css` — responsive design, cards, forms, animations and accessibility styling
- `data/markets.json` — market records
- `data/produce.json` — produce records
- `data/chatbot.json` — scripted chatbot rules
- `assets/` — project images
- `docs/` — report, test cases and diagrams

## 7. Data Flow
The supplied diagrams illustrate the visitor-to-SPA-to-JSON flow and the simplified DFD. The project intentionally has no server-side write operation.

## 8. Test Data Used
### Market data
Examples include Gulshan Green Farmers Market, Defence Fresh Market, North Nazimabad Community Market, Clifton Organic Market, Malir Harvest Market, Bahadurabad Fresh Corner and additional Karachi listings.

### Produce data
Examples include Tomatoes, Carrots, Lettuce, Mango, Cucumber, Radish, Mint, Avocado, Broccoli and Coriander.

### Chatbot test queries
- “Find a market”
- “What produce is available?”
- “What are the market hours?”
- “How do I bookmark a market?”
- “Where is Contact Us?”

## 9. Installation Instructions (Mandatory)
1. Install Node.js and npm.
2. Open the project folder in Visual Studio Code or a terminal.
3. Run `npm install` to install the React and Vite dependencies.
4. Run `npm run dev` and open the local URL printed by Vite.
5. Run `npm run build` to create the production bundle in `dist/`.
6. Test Home, Market Directory, Market Detail, Produce Guide, Chatbot, Bookmarks, About and Contact.
7. Allow browser geolocation when testing proximity/live-location functionality.

## 10. Lighthouse Validation
Use Google Lighthouse in Chrome DevTools to audit Performance, Accessibility, Best Practices and SEO. Test the main Home page and representative routes such as Directory and Market Detail. Record the final scores after testing the actual submission environment.

## 11. Constraints and Assumptions
- No backend server/database is used.
- JSON is pre-populated and read-only from the portal.
- Chatbot is static/rule-based and does not connect to live AI.
- Visitor counter is simulated locally.
- Login/Signup are non-functional demo interfaces.
- Bookmarks/notes use browser session storage.
- Geolocation requires explicit visitor permission.
- Market records are demonstration data for the project prototype.
- Google Maps requires internet access to display the embedded map.

## 12. Deliverables
This source package contains the website, documentation, installation instructions, test cases, assumptions and diagrams. The SRS separately requires an MP4 demonstration video; that video must be recorded and submitted with the final competition package.
