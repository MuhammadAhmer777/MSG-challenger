# FreshFind — SRS Test Cases

| ID | SRS Requirement | Test Data / Action | Expected Result |
|---|---|---|---|
| TC-01 | Home | Open `#home` | Logo, heading, intro, Find a Market prompt and highlights load |
| TC-02 | Rotating showcase | Stay on Home for 10 seconds | Featured market changes automatically |
| TC-03 | Seasonal recommendations | View Home seasonal section | Seasonal/this-week produce cards are visible |
| TC-04 | Cross-page search | Enter `Gulshan` in header search | Directory opens with matching results |
| TC-05 | Directory | Select area | Matching markets only are displayed |
| TC-06 | Directory | Select a day such as Saturday | Markets operating that day are displayed |
| TC-07 | Directory | Select a produce item such as Tomatoes | Markets carrying it are displayed |
| TC-08 | Directory sorting | Alphabetical / proximity / next-open | Correct sorting is applied |
| TC-09 | Market detail | Open Gulshan Green Farmers Market | Address, area, map, weekly schedule and product grid appear |
| TC-10 | Open-now status | Open a market on a matching day/time | Status displays Open now; otherwise Currently closed |
| TC-11 | Produce Guide | Search Tomatoes | Tomato card shows description, season and linked markets |
| TC-12 | Produce category | Select Vegetables / Fruits / Herbs | Matching category results appear |
| TC-13 | Chatbot | Ask “Find a market” | Static response appears with Market Directory link |
| TC-14 | Chatbot quick reply | Click Produce | Static response and Produce Guide link appear |
| TC-15 | Chatbot constraint | Inspect network/project | No live AI/backend chatbot dependency exists |
| TC-16 | Bookmark market | Click market heart | Market appears in Bookmarks |
| TC-17 | Bookmark produce | Click produce heart | Produce appears in Bookmarks |
| TC-18 | Session note | Add a note to a bookmark | Note remains during current browser session |
| TC-19 | Export | Click Export Bookmarks | Formatted text file is generated on request |
| TC-20 | Share | Click Share | Native share or clipboard fallback is used |
| TC-21 | Contact | Open Contact | Static details and map are visible |
| TC-22 | Geolocation | Click Use My Location and grant permission | Map updates to permitted browser coordinates and nearby sorting becomes available |
| TC-23 | Geolocation denial | Deny permission | Clear fallback message appears; area search remains available |
| TC-24 | About | Open About | Static platform/team information is visible |
| TC-25 | Visitor counter | Reload page | Simulated local count increments |
| TC-26 | Real-time clock | Observe header | Time updates every second |
| TC-27 | Accessibility | Keyboard-tab through controls | Visible focus states and usable controls are present |
| TC-28 | Responsive | Test desktop/tablet/mobile | Layout adapts without horizontal overflow |
| TC-29 | JSON | Run `npm run dev` | Markets, produce and chatbot data load |
| TC-30 | No backend | Inspect architecture | No server/database dependency is required |
| TC-31 | Dummy Login | Click Log in | Demo modal opens and does not store credentials |
| TC-32 | Dummy Signup | Submit matching demo passwords | Demo success appears and credentials are not stored |
| TC-33 | Breadcrumb | Open a market detail | Home / Market Directory / Market breadcrumb is shown |
| TC-34 | Safety | Use website normally | No unsolicited downloads or malicious actions occur |

## Test Data
Markets: Gulshan Green Farmers Market, Defence Fresh Market, North Nazimabad Community Market, Clifton Organic Market, Malir Harvest Market, Bahadurabad Fresh Corner and the additional Karachi market records.

Produce: Tomatoes, Carrots, Lettuce, Mango, Cucumber, Radish, Mint, Avocado, Broccoli and Coriander.

Chatbot queries: market search, produce availability, hours, bookmarks, contact and FreshFind/about queries.
