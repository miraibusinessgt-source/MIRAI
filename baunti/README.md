# Baunti website

Static build of baunti's marketing site, demo and client portal. Deploy this folder as-is
(Netlify: set the base directory to `baunti/`, no build command, publish directory `.`;
or drag the folder onto Netlify Drop).

## v7 (November 2026)

- **Legal** (`/legal/`): legal notice, privacy policy, website terms, cookie policy and
  responsible-collections commitments, in Spanish and English. Short links: `/privacidad`,
  `/terminos`, `/cookies` (and `/privacy`, `/terms`).
- **Footer legal links and cookie notice** (`assets/baunti-legal.*`): added to every page without
  touching the app bundle. Essential storage is always on; measurement is optional and off until the
  visitor allows it. Anything optional must check `window.bauntiConsent.get()` or listen for the
  `baunti:consent` event before it loads.
- **New demo** (`/demo/`): a guided conversation on a 3D phone, with a live team panel. Runs fully in
  the browser. The previous full simulator is at `/demo/simulador/`.

## Before relying on the legal pages

The legal texts are a working draft built from the team's "Legal setup in Guatemala" brief. Have a
Guatemalan abogado y notario review them, then fill in what is still pending in `legal/index.html`:

- Legal name, Registro Mercantil number, NIT and registered address (once the company exists).
- A dedicated privacy contact address (today requests go through the contact form).
- Retention periods and the 30-day response time, confirmed against the client contract.
