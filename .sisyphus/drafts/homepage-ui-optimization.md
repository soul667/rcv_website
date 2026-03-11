# Draft: Homepage UI Optimization

## Requirements (confirmed)
- optimize homepage interface
- footer section uses too many bullet points; remove them
- improve the typography/layout of the RCV Lab intro text block

## Technical Decisions
- limit scope to homepage presentation updates in existing React/Tailwind components
- preserve current bilingual content model in `src/components/LanguageContext.tsx`
- preserve existing dark/glass visual language while simplifying information density
- do not add new automated test infrastructure; use build verification and agent-executed UI QA

## Research Findings
- `src/App.tsx` renders `HomePage` for the home route and always includes `Footer`
- `src/components/HomePage.tsx` contains only `Hero` and a lab-description section using `hero.description1` and `hero.description2`
- `src/components/Footer.tsx` currently renders a 4-column footer with quick-link bullets and research-area pill items
- `src/components/LanguageContext.tsx` stores the exact intro copy in `hero.description1` and `hero.description2`
- no test or Playwright setup exists in `package.json`; current verification baseline is `vite build`

## Open Questions
- none; default assumption is a targeted homepage polish, not a full visual redesign

## Scope Boundaries
- INCLUDE: footer simplification, intro section re-layout, spacing/typography polish, responsive homepage refinement
- EXCLUDE: router changes, copy rewrites, new pages, new data model, test framework setup
