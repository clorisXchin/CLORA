# CLORA — Creative Digital Studio Website

A responsive, multi-page website inspired by the **functionality and general information architecture** of a full-service digital marketing agency such as Allegiant Digital, but with **original CLORA design, content, graphics, and interactions**.

**Brand direction:** black-violet tech grid, liquid-glass butterfly, lilac/violet glow, lowercase `clora`, and “DESIGN · SOCIAL · COLLAB”.

## Pages

| File | What it does |
|---|---|
| `index.html` | Hero, brand promise, services, process, portfolio, notes, searchable FAQ, CTAs |
| `services.html` | Six service offerings, deep links, CTAs |
| `work.html` | Filterable concept portfolio with accessible detail dialogs |
| `about.html` | CLORA origin, values, and a clearly labeled team placeholder |
| `insights.html` | Searchable/filterable field notes, expandable full reads, copy summary |
| `audit.html` | **Project Fit Finder:** client-side questionnaire and personalized rules-based suggestions |
| `contact.html` | Project inquiry form with required-field/email validation, budget/timeline selectors and consent |
| `privacy.html` | Demo privacy & cookies information; must be tailored before launch |
| `404.html` | Friendly fallback page |

## Interactive features included

- Responsive navigation, collapsible Services menu, keyboard escape behavior
- Header and CTAs linking to real internal pages
- Searchable FAQ with native disclosure controls
- Portfolio category filters and project detail overlays
- Insights category and keyword filters, articles and copy-to-clipboard
- Rules-based project-fit questionnaire with service suggestions
- Contact form with field validation, honeypot and opt-in checkbox
- **Default:** prepares a pre-filled email draft through `mailto:` — it does **not** claim a message was successfully submitted
- **Optional:** POST to a configured form backend (e.g. Formspree-compatible JSON endpoint)
- Cookie notice/preferences in local storage; **no tracking/advertising scripts added**
- Back-to-top control, scroll progress, focus outlines, reduced-motion support
- Basic metadata and accessible HTML

## Run locally

The site uses standard HTML, CSS and JavaScript. No build step is needed.

1. Extract the ZIP.
2. Open `index.html` directly, or for a local server run:

   ```bash
   cd clora-website
   python -m http.server 8000
   ```

3. Visit `http://localhost:8000/`.

## Before launching — important

1. **Connect the form.** Edit `js/config.js`:

   ```js
   window.CLORA_CONFIG = {
     contactEmail: 'hello@your-real-domain.com',
     formEndpoint: 'https://formspree.io/f/YOUR_REAL_FORM_ID'
   };
   ```

   Set `formEndpoint` to an empty string to use **email draft mode** instead. Do not use the default `.example` address; it is a deliberate placeholder. Ensure your chosen form provider accepts JSON requests and supports requests from your site origin. For providers requiring an API key, use a server-side proxy—do not expose secrets in front-end JavaScript.

2. **Update the business details.** Change copy about services to what you actually provide. Replace team placeholder, concept portfolio pieces with real work as available, and add real contact/social links. Avoid publishing fabricated testimonials, results, or credentials.
3. **Legal/privacy.** Review and replace `privacy.html`, consent language and cookie choices with notices appropriate to your actual services, region and analytics stack. The demo does not run advertising analytics.
4. **SEO/domain.** Add your final domain-specific canonical tags, `robots.txt`, sitemap, production Open Graph absolute URLs, analytics (only with appropriate consent), and search console configuration.
5. **Accessibility/performance.** Test your final content on actual devices and screen readers. The Plus Jakarta Sans font is optionally fetched from Google Fonts; the system font fallback works without internet. Self-host fonts only when licensed.
6. **Deploy.** Upload the contents to Netlify, Cloudflare Pages, GitHub Pages, Vercel static hosting, or any static web server. Set the custom 404 route if supported.

## Editing tips

- CSS theme tokens are at the beginning of `css/style.css`.
- Logo assets are in `assets/`, based on the existing CLORA butterfly image generated for this project.
- `js/app.js` contains interactive functionality and demo project/article data.
- You may directly edit the HTML pages. `build_pages.py` is provided as an optional source generator, **but running it will overwrite the HTML pages** using its embedded page templates.
- All portfolio examples are explicitly labeled **concepts**. The fit finder is **not** a real website crawler or SEO/AI score.

## Reference and originality

The requested reference website was used to understand common agency features such as navigation, services, case studies, audit request, FAQs and contact flows. This site is **not an exact visual or textual clone** of Allegiant Digital and does not include its proprietary tools or business claims.
