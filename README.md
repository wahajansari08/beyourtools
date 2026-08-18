# BeYourTools

A JSON tools website built with Next.js 15 (App Router), React, TypeScript, and Tailwind CSS.
Every tool runs entirely client-side - nothing pasted into the app is ever sent to a server.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's included (MVP)

20 tools are fully implemented and live:

- **Format & Validate:** JSON Formatter, Beautifier, Validator, Minifier, Viewer/Tree, Editor, Repair, JSONL Formatter, JSONL Validator
- **Compare & Manipulate:** JSON Diff/Compare, Sorter, Merge, Flatten/Unflatten
- **Convert:** JSON↔CSV, JSON↔YAML, JSON↔XML
- **Encode & Inspect:** Base64 Encode/Decode, JWT Decoder, JSON Token Counter

10 more tools are scaffolded in the registry (`lib/tools-config.ts`) and show as
"Coming soon" on the homepage: JSON Merge dependents like JSONPath Tester, JSON→TypeScript,
JSON→Python, JSON→SQL, JSON→Excel, JSON Schema Generator, JSON Schema Validator, and JSON Generator.

## Adding a new tool

The project is structured so adding tool #21 takes four small steps:

1. **Add the tool logic** in `lib/json/`, `lib/converters/`, `lib/generators/`, or `lib/encoders/`.
   Keep it a pure function: `(input, options) => { output, error }`.
2. **Flip `live: true`** for the tool's entry in `lib/tools-config.ts` (or add a new entry).
   This automatically makes it appear as a clickable card on the homepage and in "related tools".
3. **Create `app/<slug>/page.tsx`** - a server component that renders `<ToolLayout>` with the
   tool's title/description/category, wrapping a client component.
4. **Create `app/<slug>/<Name>Client.tsx`** - for most single-input/output tools, wrap
   `<TextTransformTool transform={...} .../>` from `components/TextTransformTool.tsx`. For
   dual-pane tools (like diff or merge), follow the pattern in `app/json-diff/DiffClient.tsx`.

## Project structure

```
BeYourTools/
├── app/
│   ├── json-formatter/{page.tsx, FormatterClient.tsx}
│   ├── json-validator/{page.tsx, ValidatorClient.tsx}
│   ├── ...one folder per tool
│   ├── layout.tsx        # fonts, nav, footer
│   ├── page.tsx           # homepage / tool directory
│   └── globals.css
│
├── components/
│   ├── ToolLayout.tsx      # shared page chrome (header + related tools)
│   ├── ToolHeader.tsx
│   ├── ToolInput.tsx       # labeled textarea panel
│   ├── ToolOutput.tsx      # labeled read-only output panel (or custom children, e.g. tree view)
│   ├── TextTransformTool.tsx  # generic single input -> single output tool shell
│   ├── JsonTree.tsx         # collapsible tree renderer
│   ├── JsonEditor.tsx       # editable JSON + live tree preview
│   ├── CopyButton.tsx / DownloadButton.tsx / FileUploader.tsx
│   ├── SegmentedControl.tsx # small option toggle used in toolbars
│   ├── StatusBanner.tsx
│   ├── RelatedTools.tsx
│   └── Navbar.tsx / Footer.tsx
│
└── lib/
    ├── tools-config.ts     # single source of truth: every tool's slug/name/category/status
    ├── json/
    │   ├── formatter.ts, validator.ts, minifier.ts, diff.ts,
    │   ├── flatten.ts, repair.ts, sorter.ts, merge.ts
    ├── converters/
    │   ├── csv.ts, yaml.ts, xml.ts
    ├── encoders/
    │   ├── base64.ts, jwt.ts, tokens.ts
    └── generators/          # reserved for typescript.ts, python.ts, sql.ts, schema.ts
```

## Design system

Dark, developer-tool aesthetic: near-black ink background, amber accent for strings/primary
actions, teal for success/keys, coral for errors - mirroring common JSON syntax highlighting.
Space Grotesk for display type, Inter for body copy, JetBrains Mono for all code/data surfaces.
Tokens live in `tailwind.config.ts` (`ink`, `mist`, `amber`, `teal`, `coral`).

## Scaling notes

- Every tool page is a plain Next.js route, so this deploys as-is to Vercel or any Node host.
- All processing happens in the browser (no API routes, no database) - the app scales as a
  static/edge-cacheable site with effectively no backend cost.
- When you're ready to add server-backed features (auth, saved snippets, larger file processing),
  add API routes under `app/api/` - the current architecture doesn't block that.
