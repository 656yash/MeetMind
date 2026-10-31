# Skydive 3D Landing Clone Brief

## 1. Route Map
- **Source**: `https://www.skydive.com/` (Starting 3D Landing Scene)
- **Local Route**: `/` (`src/app/page.tsx`)
- **Main Component**: `src/components/sites/skydive/OfficeDiorama.tsx`
- **Models**: `public/sites/skydive/models/` (`grace.efd28c89.glb`, `emma.9e069a86.glb`)

## 2. Visual Architecture & 3D Environment
- **Perspective Camera**: FOV 28-30°, isometric viewing angle at `(0, 310, 800)` looking at center `(0, 32, 0)`
- **Studio Lighting**: Key directional light with soft shadows, cool fill light, warm rim light, and soft ambient fill
- **Podium Base Slab**: Rounded-corner wooden slab rotated 45° in diamond isometric perspective with soft radial ground shadow
- **Parquet Flooring**: Procedural high-resolution warm honey oak parquet wood texture
- **Center Rug**: Circular cream wool rug with the signature 5-petal circular pinwheel flower (coral pink, deep orange, golden yellow, leaf green, cyan teal)
- **Modern Sofa & Lounge**:
  - Light grey upholstered sofa with plush double cushions, backrest, armrests, and dark wood legs
  - Orange and cream throw pillows
  - Low-poly segmented pumpkin with green stem on the floor
- **Walnut Desk & Agent Computer**:
  - Dark walnut executive desk with slim legs
  - Open aluminum laptop with glowing code editor on screen and Skydive logo on lid
  - Erika nameplate badge and orange ceramic coffee mug
  - Upholstered desk chair
  - Agent character in white hoodie typing at the laptop
- **Integrations Vending Machine**:
  - Cream tall cabinet with illuminated "INTEGRATIONS" marquee banner
  - Recessed glass showcase chamber
  - 3 shelves stocked with colorful integration product boxes (Slack, GitHub, Discord, Google Drive, Gmail, Notion, Linear, Stripe, etc.)
  - Keypad panel and dispenser slot

## 3. Overlay & Interactions
- **Typography**: Hero title `Skydive` in heavy grotesque sans at 12–14vw
- **Floating Dock**: Translucent frosted glass capsule with:
  - `View map` button with globe icon
  - `Get started →` button in deep charcoal
  - `Learn more ↗` link
- **Interactions**:
  - Smooth mouse parallax tilting the diorama
  - OrbitControls for 3D exploration with damping and restrained polar angles
  - Gentle idle floating/breathing animation on room and character

## 4. Verification & Status
- `npm run check` passed (ESLint, TypeScript strict, Next.js Turbopack build)
- Dev server running on `http://localhost:3000`
