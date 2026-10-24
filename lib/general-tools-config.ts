/**
 * General tools configuration: Text Tools, Developer Tools, Calculators.
 * All tools are 100% client-side. Each entry carries unique human-written
 * copy (tagline, how-to, FAQs) used by GeneralToolPageShell.
 */

export type GeneralToolCategory = "Text Tools" | "Developer Tools" | "Calculators";

export interface GeneralToolFAQ {
  question: string;
  answer: string;
}

export interface GeneralTool {
  slug: string;
  name: string;
  description: string;
  category: GeneralToolCategory;
  /** Hub page path, e.g. "/text-tools" */
  hub: string;
  title: string;
  metaDescription: string;
  tagline: string;
  keywords: string[];
  howTo: { title: string; text: string }[];
  features: string[];
  faqs: GeneralToolFAQ[];
  related: string[];
}

export const GENERAL_HUBS: { slug: string; path: string; name: string; description: string }[] = [
  {
    slug: "text-tools",
    path: "/text-tools",
    name: "Text Tools",
    description: "Count words, convert case, encode URLs and generate placeholder text - free, in your browser.",
  },
  {
    slug: "developer-tools",
    path: "/developer-tools",
    name: "Developer Tools",
    description: "Regex tester, UUID and password generators, hash calculator and timestamp converter for developers.",
  },
  {
    slug: "calculators",
    path: "/calculators",
    name: "Calculators",
    description: "Everyday calculators and handy utilities: percentages, BMI, age, unit conversion, scientific math, timers, time zones and more - instant answers with no sign-up.",
  },
];

export const generalTools: GeneralTool[] = [
  // ══════════════════════════ TEXT TOOLS ══════════════════════════
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences and paragraphs with reading time, readability scores, word targets and keyword density.",
    category: "Text Tools",
    hub: "/text-tools",
    title: "Word Counter - Count Words & Characters Online | BeYourTools",
    metaDescription:
      "Free online word counter: words, characters, sentences, paragraphs, reading time and keyword density. Live counts as you type - no sign-up.",
    tagline:
      "Writing to a limit? Paste your text and watch live counts for words, characters, sentences and reading time update as you type - plus Flesch readability scores, a word-count target tracker, and autosave that keeps your draft safe.",
    keywords: ["word counter", "character counter", "count words online", "word count tool", "reading time calculator", "keyword density checker"],
    howTo: [
      { title: "Paste or type", text: "Drop your text into the editor - a novel chapter, an essay, a tweet draft, anything." },
      { title: "Read live stats", text: "Words, characters (with and without spaces), sentences and paragraphs update with every keystroke." },
      { title: "Check reading time", text: "See estimated reading and speaking time based on average speeds." },
      { title: "Inspect keywords", text: "The top-5 keyword density table shows which words dominate your text." },
    ],
    features: [
      "Live word, character and sentence counts",
      "Characters with and without spaces",
      "Reading and speaking time estimates",
      "Flesch Reading Ease and grade-level scores",
      "Word-count target tracker with progress bar",
      "Autosave - your draft survives a refresh",
      "Top-5 keyword density analysis",
      "Paragraph and sentence breakdown",
      "Private - text never leaves your browser",
    ],
    faqs: [
      { question: "How are words counted?", answer: "Words are sequences of characters separated by whitespace. Hyphenated compounds count as one word, which matches how most editors and publishing platforms count." },
      { question: "What is keyword density and why does it matter?", answer: "Keyword density is how often a word appears relative to total words. Writers use it to spot accidental repetition; SEOs use it as a rough check that a target phrase appears naturally without stuffing." },
      { question: "How is reading time estimated?", answer: "We use 200 words per minute for silent reading and 130 for speaking aloud - widely used averages. Dense technical text will take most people a little longer." },
      { question: "What do the readability scores mean?", answer: "Flesch Reading Ease runs 0-100, where higher is easier: 60-70 suits a general audience, 30-50 is typical of academic writing. The grade level estimates the US school grade needed to follow the text. Shorten sentences and swap long words for simple ones to raise the score." },
      { question: "How does the word target work?", answer: "Type a target like 500 into the target box and a progress bar tracks your draft against it, telling you how many words remain. Both your text and the target are autosaved in this browser." },
      { question: "Is there a text length limit?", answer: "No hard limit. The counter handles book-length text comfortably since everything runs locally in your browser." },
      { question: "Is my text uploaded anywhere?", answer: "No. Counting happens entirely in your browser tab. Your text is never sent to a server; the autosave lives in your own browser storage only." },
    ],
    related: ["case-converter", "lorem-ipsum-generator", "url-encoder-decoder", "json-formatter"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between UPPER, lower, Title, camelCase, snake_case, kebab-case and more.",
    category: "Text Tools",
    hub: "/text-tools",
    title: "Case Converter - UPPER, lower, camelCase, snake_case | BeYourTools",
    metaDescription:
      "Free case converter: UPPER CASE, lower case, Title Case, camelCase, snake_case, kebab-case, aLtErNaTiNg and InVeRsE. Instant, in your browser.",
    tagline:
      "ACCIDENTALLY WROTE IN CAPS? Turn any text into the case you actually need - from code identifiers to proper headlines.",
    keywords: ["case converter", "upper to lower case", "camelcase converter", "snake case converter", "title case converter", "text case changer"],
    howTo: [
      { title: "Paste your text", text: "Drop in the text you want to transform." },
      { title: "Pick a case", text: "Choose from UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, aLtErNaTiNg or InVeRsE." },
      { title: "Copy the result", text: "The converted text appears instantly - copy it with one click." },
    ],
    features: [
      "10 case styles including code conventions",
      "camelCase, PascalCase, snake_case, kebab-case",
      "Sentence and Title case for prose",
      "Instant conversion as you type",
      "One-click copy",
    ],
    faqs: [
      { question: "What's the difference between camelCase and PascalCase?", answer: "camelCase starts lowercase (myVariableName) and is common in JavaScript; PascalCase starts uppercase (MyClassName) and is common for class names. snake_case (my_variable) is typical in Python, kebab-case (my-variable) in URLs and CSS." },
      { question: "How does Title Case handle small words?", answer: "Our Title Case capitalizes every word except short articles, prepositions and conjunctions (a, an, the, and, of, in…), following standard headline style." },
      { question: "What do aLtErNaTiNg and InVeRsE do?", answer: "aLtErNaTiNg alternates lowercase/uppercase per letter for that mocking-spongebob meme style. InVeRsE flips the case of every letter: 'Hello' becomes 'hELLO' - handy for fixing text typed with Caps Lock on." },
      { question: "Does it work on large documents?", answer: "Yes - conversion is a simple local string operation, so even very long texts convert instantly." },
    ],
    related: ["word-counter", "url-encoder-decoder", "lorem-ipsum-generator", "base64"],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text by paragraphs, sentences or words for mockups and layouts.",
    category: "Text Tools",
    hub: "/text-tools",
    title: "Lorem Ipsum Generator - Placeholder Text | BeYourTools",
    metaDescription:
      "Free lorem ipsum generator: create placeholder text by paragraphs, sentences or words. Optional classic 'Lorem ipsum…' start. Copy or download.",
    tagline:
      "Designing a layout that needs realistic-looking text? Generate exactly as much lorem ipsum as you need - no more, no less.",
    keywords: ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "lorem ipsum paragraphs"],
    howTo: [
      { title: "Choose a unit", text: "Generate by paragraphs, sentences or individual words." },
      { title: "Set the amount", text: "Dial in exactly how much filler text your mockup needs." },
      { title: "Toggle the classic start", text: "Begin with the traditional 'Lorem ipsum dolor sit amet…' or start mid-flow." },
      { title: "Copy or download", text: "Copy to clipboard or download as a .txt file." },
    ],
    features: [
      "Paragraph, sentence, word, list and character modes",
      "Bullet-list placeholder mode for navs and cards",
      "Exact character-count mode for tight spaces",
      "One-click HTML output (<p>, <ul>, <li>)",
      "Classic opening toggle",
      "Varied sentence lengths for realism",
      "Copy to clipboard in one click",
      "Download as .txt or .html",
    ],
    faqs: [
      { question: "What is lorem ipsum?", answer: "Lorem ipsum is scrambled Latin-derived placeholder text used in design since the 1960s. It looks like real copy so layouts can be judged on typography and spacing without readable content distracting reviewers." },
      { question: "Why not just use real text?", answer: "Real text invites people to critique the words instead of the design. Placeholder text keeps feedback focused on layout, and it fills space realistically unlike repeating 'test test test'." },
      { question: "How do I get lorem ipsum as HTML?", answer: "Turn on 'Wrap in HTML tags': paragraphs come wrapped in <p> tags and list items in a <ul>/<li> structure, ready to paste into a prototype. The download button saves it as a .html file." },
      { question: "What is the characters mode for?", answer: "It generates text trimmed to exactly the character count you ask for - useful for button labels, meta titles, card snippets and anywhere the copy must fit a fixed space." },
      { question: "Can I make a placeholder bullet list?", answer: "Yes - switch to the List mode. You get one sentence per item, shown as bullets, or wrapped in proper <ul>/<li> HTML with the HTML toggle on." },
      { question: "Is the generated text the same every time?", answer: "The word pool is fixed but sentences are assembled randomly, so each generation is unique. Toggle the classic start off for a fully fresh passage." },
      { question: "Can I use lorem ipsum commercially?", answer: "Yes - lorem ipsum is public domain filler with no copyright concerns. Just remember to replace it with real copy before publishing." },
    ],
    related: ["word-counter", "case-converter", "url-encoder-decoder"],
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    description: "Percent-encode and decode URLs with encodeURIComponent and full-URI modes.",
    category: "Text Tools",
    hub: "/text-tools",
    title: "URL Encoder Decoder - Percent-Encode URLs Online | BeYourTools",
    metaDescription:
      "Free URL encoder/decoder: percent-encode query strings with encodeURIComponent or encode full URIs. Decode URLs back instantly, in your browser.",
    tagline:
      "Query parameters breaking your links? Encode them properly - or decode a mangled %20-filled URL back into something readable.",
    keywords: ["url encoder", "url decoder", "percent encode url", "encodeuricomponent online", "decode url online"],
    howTo: [
      { title: "Paste your text or URL", text: "Drop in a full URL or just the query string you need encoded." },
      { title: "Choose encode or decode", text: "Switch tabs depending on which direction you're going." },
      { title: "Pick a mode", text: "Use Component mode for query values (encodes / ? & =) or Full URI mode to keep a URL's structure intact." },
      { title: "Copy the result", text: "The output updates live - copy it when it looks right." },
    ],
    features: [
      "encodeURIComponent and encodeURI modes",
      "Live encode/decode as you type",
      "Recursive decode for double-encoded strings",
      "Treat + as space (form-encoding mode)",
      "Convert a whole list of URLs line by line",
      "Handles unicode and emoji correctly",
      "One-click copy",
    ],
    faqs: [
      { question: "What's the difference between the two encode modes?", answer: "Component mode (encodeURIComponent) encodes everything except unreserved characters - use it for individual query values. Full URI mode (encodeURI) leaves : / ? & = # alone so a complete URL stays a valid URL." },
      { question: "When do I need URL encoding?", answer: "Whenever text goes inside a URL query string: spaces, ampersands, question marks, unicode characters and emoji all need percent-encoding or they'll corrupt the URL's structure." },
      { question: "Why does my URL show %20 instead of spaces?", answer: "%20 is the percent-encoded form of a space. Paste the URL into the Decode tab to turn it back into readable text." },
      { question: "What is recursive decoding?", answer: "Sometimes a string gets encoded twice, so decoding once still leaves %25 sequences behind (for example, %2520). Turn on 'Decode recursively' and the tool keeps decoding - up to 16 passes - until the text stops changing." },
      { question: "Why does a plus sign turn into a space?", answer: "HTML forms encode spaces as + rather than %20. If you are decoding form data, enable 'Treat + as space' so plus signs decode to spaces instead of staying as plus signs." },
      { question: "Can I convert many URLs at once?", answer: "Yes - enable 'Process each line separately', paste one URL per line, and every line is encoded or decoded on its own. Copy the whole result in one click." },
      { question: "Does it handle non-English characters?", answer: "Yes - unicode characters are UTF-8 encoded first, then percent-encoded, which is the web standard. Emoji work too." },
    ],
    related: ["base64", "case-converter", "word-counter", "json-formatter"],
  },
  // ════════════════════════ DEVELOPER TOOLS ════════════════════════
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong random passwords with Web Crypto - length, character sets, entropy meter.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Password Generator - Strong Random Passwords | BeYourTools",
    metaDescription:
      "Free secure password generator using Web Crypto (never Math.random). Length slider, character sets, exclude-ambiguous option, entropy meter. 100% offline.",
    tagline:
      "Stop reusing passwords. Generate cryptographically strong ones with real randomness - created in your browser, never sent anywhere.",
    keywords: ["password generator", "strong password generator", "random password", "secure password generator", "generate strong password"],
    howTo: [
      { title: "Set the length", text: "Drag the slider - 16+ characters is a solid default for important accounts." },
      { title: "Choose character sets", text: "Toggle uppercase, lowercase, numbers and symbols. More sets mean more entropy per character." },
      { title: "Exclude ambiguous characters", text: "Optionally drop lookalikes like 0/O, 1/l/I for passwords you might type by hand." },
      { title: "Generate and copy", text: "Generate one password or a batch, check the strength meter, and copy what you need." },
    ],
    features: [
      "crypto.getRandomValues - never Math.random",
      "Random passwords: length slider up to 128 characters",
      "Memorable passphrase mode (word-based)",
      "Uppercase, lowercase, numbers, symbols toggles",
      "Guaranteed minimum numbers and symbols",
      "Exclude-ambiguous-characters option",
      "Batch generation (up to 50)",
      "Live entropy strength meter",
      "Works fully offline",
    ],
    faqs: [
      { question: "Are these passwords truly random?", answer: "Yes. The generator uses crypto.getRandomValues(), the browser's cryptographically secure random number generator - the same primitive behind TLS keys. It never uses Math.random(), which is predictable and unsafe for secrets." },
      { question: "How long should my password be?", answer: "For a random password with all character sets, 16 characters gives about 105 bits of entropy - far beyond brute-force reach. 20+ is comfortable overkill. Length beats complexity: a long simple password outperforms a short complex one." },
      { question: "What does the entropy meter mean?", answer: "Entropy (bits) measures how many guesses an attacker needs on average: bits = length × log2(pool size). 80+ bits is strong, 100+ is excellent. The meter updates live as you change options." },
      { question: "Are passphrases as strong as random passwords?", answer: "Each word adds about 9 bits of entropy, so a 4-word passphrase has roughly 37 bits - fine for low-stakes logins and far easier to type than a random string. For a master password or Wi-Fi key, use 6-8 words (55-75 bits) plus the number and capitalization options." },
      { question: "Why set minimum numbers or symbols?", answer: "Many sites require at least one digit or symbol. Instead of regenerating until a password happens to include one, set the minimums and every generated password in the batch meets the rule on the first try." },
      { question: "Are my generated passwords stored or sent anywhere?", answer: "No. Generation happens in your browser's memory using Web Crypto. Nothing is transmitted, logged or stored - close the tab and they're gone unless you saved them." },
      { question: "Should I use the same generated password everywhere?", answer: "No - generate a unique password per site and store them in a password manager. This tool makes that painless: generate a batch and save each one." },
    ],
    related: ["uuid-generator", "hash-generator", "regex-tester"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions live with match highlighting, capture groups and a cheatsheet.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Regex Tester - Test Regular Expressions Online | BeYourTools",
    metaDescription:
      "Free regex tester: live match highlighting, capture group listing, flags, common-pattern presets and a quick cheatsheet. JavaScript regex in your browser.",
    tagline:
      "Regex not matching and you can't see why? Paste your pattern and test string - matches light up live while you debug.",
    keywords: ["regex tester", "regular expression tester", "test regex online", "regex debugger", "regex cheatsheet"],
    howTo: [
      { title: "Enter your pattern", text: "Type the regex without slashes, then toggle flags (g, i, m, s, u) as needed." },
      { title: "Add test text", text: "Paste the string you're matching against - logs, form input, whatever it is." },
      { title: "Inspect matches", text: "Matches highlight in the text; the panel below lists each match with its capture groups." },
      { title: "Try a preset", text: "Stuck? Load a common pattern (email, URL, date…) and adapt it." },
    ],
    features: [
      "Live match highlighting",
      "Capture group listing per match",
      "Find-and-replace preview tab",
      "Shareable links that restore your test",
      "Flag toggles (g i m s u y)",
      "Common-pattern presets",
      "Built-in regex cheatsheet",
      "Clear invalid-pattern errors",
    ],
    faqs: [
      { question: "Which regex flavor is this?", answer: "JavaScript (the same engine as your browser). Most syntax transfers to Python, Java and PCRE, but lookbehind and some advanced features differ between flavors - always re-test in your target language." },
      { question: "Why is my pattern marked invalid?", answer: "The error message shows the browser's exact complaint - usually an unclosed bracket, a stray backslash, or a bad quantifier. Fix it in the pattern box and highlighting resumes instantly." },
      { question: "What's the difference between the g and m flags?", answer: "g (global) finds all matches instead of stopping at the first. m (multiline) makes ^ and $ match at line boundaries, not just the string's start/end. They're independent - you often want both." },
      { question: "How do capture groups work here?", answer: "Parentheses create numbered groups. Each match row expands to show group 1, 2, 3… with their captured text - use (?:…) for non-capturing groups when you don't need the value." },
      { question: "How do I test a find-and-replace?", answer: "Switch to the Replace tab and type a replacement string. Use $1, $2 for capture groups, $& for the whole match, and $<name> for named groups. The result previews live, so you can sanity-check a bulk rename before touching real data." },
      { question: "How do share links work?", answer: "Click 'Copy share link' and the pattern, flags, test text and replacement are packed into the URL hash (after #r=). Anyone opening the link sees your exact test restored - handy for code reviews and Stack Overflow questions." },
      { question: "Is catastrophic backtracking a risk?", answer: "In this tester, a runaway pattern just freezes your tab briefly - close it if needed. In production code, avoid nested quantifiers like (a+)+ and prefer atomic groups or possessive quantifiers where your flavor supports them." },
    ],
    related: ["uuid-generator", "password-generator", "json-formatter", "case-converter"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate bulk v4 UUIDs with Web Crypto - uppercase/lowercase, hyphens on/off, copy all.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "UUID Generator - Bulk v4 UUIDs Online | BeYourTools",
    metaDescription:
      "Free UUID generator: bulk v4 UUIDs via crypto.randomUUID(). Uppercase/lowercase, hyphens on/off, copy-all. No sign-up, runs in your browser.",
    tagline:
      "Need a batch of IDs for your database seed or test fixtures? Generate hundreds of v4 UUIDs in one click.",
    keywords: ["uuid generator", "guid generator", "generate uuid v4", "bulk uuid generator", "uuid v4 online"],
    howTo: [
      { title: "Set the count", text: "Choose how many UUIDs you need - 1 to 1000." },
      { title: "Pick formatting", text: "Toggle uppercase and hyphens to match your system's expected format." },
      { title: "Generate", text: "One click produces the full batch instantly." },
      { title: "Copy", text: "Copy individual UUIDs or grab the whole list with Copy All." },
    ],
    features: [
      "crypto.randomUUID() - real v4 randomness",
      "Bulk generation up to 1000",
      "Uppercase / lowercase toggle",
      "Hyphens on/off",
      "Copy individual or copy-all",
      "One per line for easy pasting",
    ],
    faqs: [
      { question: "What UUID version is generated?", answer: "Version 4 (random). Each UUID has 122 random bits, generated by the browser's crypto.randomUUID() - the same API used by secure systems, not a Math.random() hack." },
      { question: "Can UUIDs collide?", answer: "In practice, no. With 122 random bits you'd need to generate about a billion UUIDs per second for 85 years to reach a 50% collision chance. For IDs, v4 is effectively unique." },
      { question: "Should I use UUIDs as database primary keys?", answer: "They work, but random UUIDs fragment indexes in some databases. If you need sortable IDs, consider UUIDv7 (time-ordered) - this tool generates v4, which is best for tokens, request IDs and test data." },
      { question: "What's the difference between UUID and GUID?", answer: "They're the same 128-bit format - GUID is just Microsoft's name for UUID. A v4 UUID works wherever a GUID is expected." },
    ],
    related: ["password-generator", "hash-generator", "regex-tester", "timestamp-converter"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Hash text or files with MD5, SHA-1, SHA-256, SHA-384, SHA-512 - in your browser.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Hash Generator - MD5, SHA-256, SHA-512 Online | BeYourTools",
    metaDescription:
      "Free hash generator: MD5, SHA-1, SHA-256, SHA-384, SHA-512 for text or files. Web Crypto for SHA, computed locally - nothing uploaded.",
    tagline:
      "Verify a download or fingerprint a string - hash text or whole files with five algorithms, all computed on your device.",
    keywords: ["hash generator", "md5 generator", "sha256 online", "sha512 hash", "file hash checker", "checksum calculator"],
    howTo: [
      { title: "Enter text or drop a file", text: "Type/paste text, or drop a file to hash its exact bytes." },
      { title: "Hashes compute instantly", text: "All five algorithms run at once - MD5, SHA-1, SHA-256, SHA-384, SHA-512." },
      { title: "Compare or copy", text: "Toggle uppercase for legacy systems, copy any hash with one click." },
    ],
    features: [
      "MD5, SHA-1, SHA-256, SHA-384, SHA-512",
      "Text and file input",
      "Verify against an expected checksum",
      "Web Crypto for the SHA family",
      "Uppercase toggle",
      "Per-hash copy buttons",
      "Files hashed locally - never uploaded",
    ],
    faqs: [
      { question: "Which hash should I use?", answer: "For security (passwords, signatures): SHA-256 or SHA-512. For checksums and legacy compatibility: MD5 or SHA-1 are fine for non-adversarial integrity checks, but both are broken against attackers - never use them for passwords or signatures." },
      { question: "Why isn't there SHA-3?", answer: "Browsers' Web Crypto API doesn't include SHA-3, and this tool only uses built-in crypto (plus a compact audited MD5 implementation) so it works fully offline. SHA-256/512 cover the same use cases." },
      { question: "Can I hash a large file?", answer: "Yes - files are streamed through the hash in chunks, so multi-gigabyte files work without loading everything into memory. It just takes a little longer." },
      { question: "How do I verify a downloaded file?", answer: "Download pages usually publish a SHA-256 checksum next to the file. Hash your downloaded file here, paste the published checksum into the 'Expected hash' box, and the tool tells you instantly whether they match - across all five algorithms at once." },
      { question: "What does a checksum mismatch mean?", answer: "The file you have is byte-for-byte different from the one the publisher checksummed. Re-download it; if it still mismatches, don't run or install it - it may be corrupted or tampered with." },
      { question: "Is hashing the same as encryption?", answer: "No. Hashing is one-way: you can't get the original back from a hash. That's what makes hashes useful for verification and (with proper salting) password storage." },
      { question: "Are my files uploaded to compute the hash?", answer: "No. Hashing runs entirely in your browser - for files, the bytes are read locally and only the digest is ever displayed." },
    ],
    related: ["password-generator", "uuid-generator", "base64", "timestamp-converter"],
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps (seconds/ms auto-detect) to dates and back, UTC/local, relative time.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Timestamp Converter - Unix Time to Date | BeYourTools",
    metaDescription:
      "Free timestamp converter: Unix seconds/milliseconds auto-detect to human date and back. UTC/local toggle, 'now' button, relative time ('3 hours ago').",
    tagline:
      "Staring at 1729185600 and wondering when that was? Convert Unix timestamps to readable dates - or dates back to timestamps.",
    keywords: ["timestamp converter", "unix timestamp to date", "epoch converter", "unix time converter", "datetime to timestamp"],
    howTo: [
      { title: "Paste a timestamp", text: "Seconds or milliseconds - the tool auto-detects which (10 vs 13 digits)." },
      { title: "Read the date", text: "See the full date in your local timezone and in UTC, plus relative time like '3 hours ago'." },
      { title: "Or go the other way", text: "Pick a date/time to get its Unix timestamp in both precisions." },
      { title: "Use 'Now'", text: "One click fills in the current timestamp." },
    ],
    features: [
      "Seconds/milliseconds auto-detect",
      "Local timezone and UTC display",
      "Relative time ('in 2 days', '3 hours ago')",
      "Date picker for reverse conversion",
      "'Now' button for current timestamp",
      "Copy any value in one click",
    ],
    faqs: [
      { question: "How do I tell seconds from milliseconds?", answer: "Count the digits: 10 digits is seconds (until the year 2286), 13 digits is milliseconds. The tool checks the magnitude automatically, so you can paste either." },
      { question: "What timezone are results shown in?", answer: "Both: your browser's local timezone and UTC. Toggle between them - servers and logs usually want UTC, humans usually want local." },
      { question: "What is the Year 2038 problem?", answer: "32-bit systems store Unix time in a signed 32-bit integer, which overflows on 19 January 2038. Modern 64-bit systems and JavaScript (which uses milliseconds as floats) are unaffected." },
      { question: "Why do APIs use Unix timestamps?", answer: "A single number is unambiguous: no timezone confusion, no format debates (MM/DD vs DD/MM), and trivial to compare or sort. This tool translates them back into human terms." },
    ],
    related: ["uuid-generator", "hash-generator", "json-formatter", "regex-tester"],
  },
  // ══════════════════════════ CALCULATORS ══════════════════════════
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "X% of Y, X is what % of Y, and percentage increase/decrease - three modes.",
    category: "Calculators",
    hub: "/calculators",
    title: "Percentage Calculator - % of, Percent Change | BeYourTools",
    metaDescription:
      "Free percentage calculator: X% of Y, X is what percent of Y, and percentage increase/decrease. Instant answers, no sign-up.",
    tagline:
      "Tips, discounts, markups, exam scores - five little modes that answer every 'what percent…?' question, each with step-by-step working.",
    keywords: ["percentage calculator", "percent of calculator", "percentage increase calculator", "what percent of", "percent change calculator"],
    howTo: [
      { title: "Pick a mode", text: "'X% of Y' for discounts and tips, 'X is what % of Y' for scores and shares, 'Change' for growth or decline." },
      { title: "Enter the numbers", text: "Type the two values - results update as you type." },
      { title: "Read the answer", text: "Get the result plus the formula used, so you can double-check the math." },
    ],
    features: [
      "Five modes: of / is-what-%-of / change / increase-decrease / difference",
      "Live results as you type",
      "Step-by-step working shown under every answer",
      "Increase or decrease a value by a percentage",
      "Symmetric percentage-difference mode",
      "Handles negative results and edge cases",
      "Decimal-friendly",
    ],
    faqs: [
      { question: "How do I calculate a 20% tip?", answer: "Use 'X% of Y': X = 20, Y = your bill. The tool shows the tip amount - add it to the bill for the total. Same mode works for discounts: a 20% discount means you pay 80%." },
      { question: "How do I calculate a sale price after a discount?", answer: "Use the 'Increase / decrease by %' mode: X = the original price, Y = the discount percent, direction = Decrease. Example: $100 decreased by 20% = $80, with each step of the arithmetic shown." },
      { question: "What's the difference between percent change and percentage points?", answer: "Going from 20% to 25% is a 5 percentage-point increase but a 25% relative increase. The Change mode computes the relative change: (new − old) / old × 100." },
      { question: "What is the % difference mode for?", answer: "Percentage difference compares two numbers symmetrically using their average as the base, so swapping the values gives the same answer. Use it when neither value is clearly the 'old' one - for example, comparing two quotes or two test scores." },
      { question: "How do I find what percent one number is of another?", answer: "Use the second mode: e.g. 45 is what % of 60? Divide 45 by 60 and multiply by 100 = 75%. Handy for test scores and completion rates." },
      { question: "Can it handle a decrease, like a price drop?", answer: "Yes - the Change mode accepts a new value lower than the old one and reports a negative percentage, e.g. −30%. For applying a decrease to get a final price, use the Increase / decrease mode instead." },
    ],
    related: ["bmi-calculator", "age-calculator", "discount-calculator", "loan-payment-calculator"],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Body Mass Index with metric/imperial toggle, category and healthy range indicator.",
    category: "Calculators",
    hub: "/calculators",
    title: "BMI Calculator - Body Mass Index | BeYourTools",
    metaDescription:
      "Free BMI calculator with metric/imperial toggle. See your BMI, category (underweight to obese) and healthy weight range. No sign-up.",
    tagline:
      "One number that puts your weight in context - with the healthy range for your height, not just a label.",
    keywords: ["bmi calculator", "body mass index calculator", "calculate bmi", "bmi chart", "healthy bmi range"],
    howTo: [
      { title: "Choose units", text: "Metric (kg/cm) or imperial (lb/ft/in) - switch anytime." },
      { title: "Enter height and weight", text: "Type your measurements; the result updates instantly." },
      { title: "Read your result", text: "See your BMI value, its category, and the healthy weight range for your height." },
    ],
    features: [
      "Metric and imperial units",
      "Instant BMI with category",
      "Healthy weight range for your height",
      "Visual gauge indicator",
      "No data stored - fully private",
    ],
    faqs: [
      { question: "How is BMI calculated?", answer: "BMI = weight (kg) ÷ height (m)². In imperial units that's 703 × weight (lb) ÷ height (in)². The tool does both conversions for you." },
      { question: "What do the BMI categories mean?", answer: "Under 18.5 is underweight, 18.5–24.9 healthy, 25–29.9 overweight, 30+ obese (WHO cutoffs). They're population-level screening bands, not diagnoses." },
      { question: "Is BMI accurate for athletes?", answer: "Not always - BMI can't tell muscle from fat, so very muscular people can score 'overweight' while being lean. Treat it as a rough screening tool, not a verdict; waist circumference and body-fat estimates add context." },
      { question: "What is the healthy weight range shown?", answer: "It's the weight range that would put your BMI between 18.5 and 24.9 at your height - a concrete target band rather than a single ideal number." },
      { question: "Is my health data stored?", answer: "No. Everything is computed in your browser and nothing is recorded or transmitted." },
    ],
    related: ["age-calculator", "percentage-calculator", "discount-calculator"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Age in years/months/days from date of birth, totals, weekday born, next birthday countdown.",
    category: "Calculators",
    hub: "/calculators",
    title: "Age Calculator - How Old Am I? | BeYourTools",
    metaDescription:
      "Free age calculator: exact age in years, months and days, total months/weeks/days, day of the week you were born, and next birthday countdown.",
    tagline:
      "More than just a number - your exact age down to the day, plus the fun stats around it.",
    keywords: ["age calculator", "how old am i", "calculate age from date of birth", "birthday countdown", "age in days calculator"],
    howTo: [
      { title: "Enter your date of birth", text: "Pick the date from the calendar picker or type it." },
      { title: "See your exact age", text: "Years, months and days as of today - computed precisely, leap years included." },
      { title: "Explore the extras", text: "Total months, weeks, days and hours lived, the weekday you were born, and a live countdown to your next birthday." },
    ],
    features: [
      "Exact years / months / days",
      "Total months, weeks, days, hours",
      "Day of the week born",
      "Next birthday countdown",
      "Leap-year-correct math",
      "Optional 'age at date' comparison",
    ],
    faqs: [
      { question: "How is the exact age computed?", answer: "By calendar math, not division: full years first, then remaining months, then days - with leap years handled by the real calendar. That's why it's exact, unlike dividing day counts by 365." },
      { question: "What day of the week was I born?", answer: "Enter your birth date and the tool shows it - a fun one for birthday trivia and party planning." },
      { question: "Can I calculate age at a specific date?", answer: "Yes - set a custom 'as of' date to find someone's age on a past or future date, useful for eligibility cutoffs and anniversaries." },
      { question: "Why does the next-birthday countdown matter?", answer: "It doesn't, really - but it's satisfying to watch. The countdown ticks live down to your next birthday." },
    ],
    related: ["bmi-calculator", "percentage-calculator", "timestamp-converter"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert length, weight, temperature, area, volume, speed, time, angle, power, data, pressure and energy between metric and imperial units.",
    category: "Calculators",
    hub: "/calculators",
    title: "Unit Converter - Length, Weight, Temperature & More | BeYourTools",
    metaDescription:
      "Free unit converter: length, weight, temperature, area, volume, speed, time, angle, power and data. Metric to imperial conversions with instant results, all in your browser.",
    tagline:
      "Need 5 miles in kilometers or 350°F in Celsius? Pick a category, enter a value, and get the answer instantly.",
    keywords: [
      "unit converter",
      "length converter",
      "weight converter",
      "temperature converter",
      "metric to imperial",
      "km to miles",
      "celsius to fahrenheit",
      "area converter",
      "time converter",
      "angle converter",
    ],
    howTo: [
      { title: "Pick a category", text: "Choose length, weight, temperature, area, volume, speed, time, angle, power, data, pressure or energy." },
      { title: "Enter your value", text: "Type the number you want to convert." },
      { title: "Choose the units", text: "Set the unit you are converting from and the unit you want to convert to." },
      { title: "Read the result", text: "The converted value appears instantly, with common equivalents listed below. Set the decimal places and copy the result in one click." },
    ],
    features: [
      "12 categories: length, weight, temperature, area, volume, speed, data, pressure, energy, time, angle and power",
      "Metric and imperial units side by side, including stones and nautical miles",
      "Correct temperature math for °C, °F and Kelvin",
      "Common equivalents shown with every result",
      "Swap units with one click",
      "Decimal-places control (0-6) and one-click Copy result",
      "Runs fully in your browser - no sign-up",
    ],
    faqs: [
      {
        question: "How accurate are the conversions?",
        answer:
          "Exact, within normal floating-point rounding. Length, weight, area, volume and speed use standard conversion factors, and temperature uses the correct formulas (not factors) for Celsius, Fahrenheit and Kelvin.",
      },
      {
        question: "Why does temperature need special formulas?",
        answer:
          "Most units convert with a simple multiplier, but temperature scales have different zero points. Converting °F to °C needs (°F - 32) × 5/9, not a plain factor - this tool handles that automatically.",
      },
      {
        question: "Can I convert cooking measurements?",
        answer:
          "Yes. The volume category includes cups, tablespoons, teaspoons, fluid ounces, milliliters and liters, which covers most cooking conversions.",
      },
      {
        question: "Can I control how many decimal places are shown?",
        answer:
          "Yes. Use the Decimal places control under the result to show anywhere from 0 to 6 decimal places. The setting only changes how the answer is displayed - the conversion itself is always calculated at full precision.",
      },
      {
        question: "Can I copy the converted result?",
        answer:
          "Yes. Press Copy result under the answer to copy the value and unit to your clipboard, ready to paste into a document, spreadsheet or message.",
      },
      {
        question: "Does the converter work offline?",
        answer:
          "Once the page has loaded, yes. All math runs in your browser, so no internet connection is needed after that.",
      },
      {
        question: "Is the unit converter free?",
        answer: "Yes - unlimited conversions, no sign-up, no ads on the tool itself.",
      },
    ],
    related: ["percentage-calculator", "bmi-calculator", "age-calculator"],
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    description:
      "Turn text into natural-sounding speech with voice, rate and pitch controls - plus word highlighting synced to playback, text file import and custom pronunciation fixes, right in your browser.",
    category: "Text Tools",
    hub: "/text-tools",
    title: "Text to Speech - Free Online TTS Reader | BeYourTools",
    metaDescription:
      "Free text to speech reader: paste text, pick a voice, and listen. Adjust rate and pitch, play, pause and stop - everything runs in your browser.",
    tagline:
      "Paste any text, pick a voice, and listen - with each spoken word highlighted as it plays. Proofread drafts, read articles hands-free, fix tricky pronunciations, or import a text file to listen to a whole document.",
    keywords: [
      "text to speech",
      "tts online",
      "text reader",
      "speak text aloud",
      "voice reader",
      "read my text",
    ],
    howTo: [
      { title: "Paste your text", text: "Drop in an article, a draft, or anything you want read aloud." },
      { title: "Pick a voice", text: "Choose from the voices installed on your device, often several languages." },
      { title: "Tune rate and pitch", text: "Slide the controls until the voice sounds right for your text." },
      { title: "Press play", text: "Listen with play, pause and stop controls. Your text stays on your device." },
    ],
    features: [
      "Uses your device's built-in voices - no downloads",
      "Word-by-word highlighting synced to playback",
      "Voice picker with automatic loading",
      "Speed and pitch sliders for full control",
      "Play, pause, resume and stop controls",
      "Import text from .txt files",
      "Pronunciation fixes for names and jargon",
      "Long text split into chunks so nothing is cut off",
      "Word count shown as you type",
      "100% private - text never leaves your browser",
    ],
    faqs: [
      {
        question: "Which voices are available?",
        answer:
          "The tool uses the speech voices installed on your device and browser. Chrome on desktop usually offers several English voices plus others; phones often include system voices for multiple languages. If the list looks empty, wait a moment - some browsers load voices a few seconds after the page opens.",
      },
      {
        question: "Why does it sound robotic?",
        answer:
          "Quality depends on the voice your system provides. Newer operating systems ship much better neural-sounding voices. Try a different voice from the list, and slow the rate slightly - slower speech often sounds more natural.",
      },
      {
        question: "Can I download the audio?",
        answer:
          "Not with this tool. It plays speech through your device's speakers in real time. It is made for listening and proofreading, not for generating audio files.",
      },
      {
        question: "Is there a text length limit?",
        answer:
          "Browsers can cut off very long passages, so the tool reads up to about 5,000 characters at a time and automatically splits it into sentence-sized chunks that play back to back. For longer documents, read them in sections.",
      },
      {
        question: "How does the word highlighting work?",
        answer:
          "While the voice reads, the current word is highlighted in the reading view, which scrolls to follow along. It is useful for proofreading, language learning, and helping young readers follow a story.",
      },
      {
        question: "Can I fix how it pronounces a name or acronym?",
        answer:
          "Yes. Open Pronunciation fixes and add pairs like GIF -> jif or SQL -> sequel. Each fix replaces the whole word before speaking, and your list is remembered in this browser only.",
      },
      {
        question: "Does my text get sent to a server?",
        answer:
          "No. Speech is generated by your device's built-in speech engine. Your text and your pronunciation fixes never leave your browser.",
      },
    ],
    related: ["word-counter", "case-converter", "audio-recorder"],
  },
  {
    slug: "stopwatch",
    name: "Stopwatch",
    description:
      "Free online stopwatch with millisecond precision, lap times, plus a countdown timer mode.",
    category: "Calculators",
    hub: "/calculators",
    title: "Stopwatch & Countdown Timer - Free Online | BeYourTools",
    metaDescription:
      "Free online stopwatch with millisecond precision and lap times, plus a countdown timer with an alarm. Runs in your browser - no sign-up.",
    tagline:
      "Time workouts, speeches or dinner with millisecond precision. Lap splits, a countdown mode, and zero downloads.",
    keywords: [
      "stopwatch",
      "online stopwatch",
      "countdown timer",
      "timer online",
      "lap timer",
      "millisecond stopwatch",
    ],
    howTo: [
      { title: "Choose a mode", text: "Pick Stopwatch to count up, or Timer to count down from a set time." },
      { title: "Start timing", text: "Hit start - the display updates every few milliseconds." },
      { title: "Record laps", text: "In stopwatch mode, press Lap to capture splits with per-lap deltas." },
      { title: "Reset when done", text: "Stop and reset to clear the display and the lap list." },
    ],
    features: [
      "Millisecond-precision display",
      "Lap times with per-lap deltas",
      "Countdown timer with sound alert",
      "Keyboard shortcuts (space to start/stop)",
      "Pause and resume without losing time",
      "Works in a background tab",
    ],
    faqs: [
      {
        question: "How accurate is the stopwatch?",
        answer:
          "The display updates roughly every 10 milliseconds, and elapsed time is measured against the system clock, so pausing, switching tabs, or a busy browser does not skew the result. It is accurate enough for workouts, cooking and presentations, though not for certified sports timing.",
      },
      {
        question: "What is the difference between lap and split times?",
        answer:
          "The lap list shows both: each lap's own duration and the total elapsed time when that lap ended. The delta tells you whether the latest lap was faster or slower than the one before it.",
      },
      {
        question: "Does the timer sound an alarm?",
        answer:
          "Yes. When the countdown reaches zero, the tool plays a short beep and shows a 'time's up' banner. Keep the tab open and your volume up so you hear it.",
      },
      {
        question: "Will it keep running if I switch tabs?",
        answer:
          "Yes. Time is calculated from the system clock rather than counting ticks, so switching tabs or minimizing the window does not affect accuracy.",
      },
    ],
    related: ["age-calculator", "percentage-calculator", "bmi-calculator"],
  },
  {
    slug: "markdown-previewer",
    name: "Markdown Previewer",
    description:
      "Write Markdown and see a live preview side by side, with safe rendering in your browser.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Markdown Previewer - Live Editor Online | BeYourTools",
    metaDescription:
      "Free Markdown previewer: type on the left, see formatted output on the right. Headings, lists, code blocks, tables, links and more - rendered safely in your browser.",
    tagline:
      "Type Markdown on the left, watch formatted output on the right. Headings, lists, code, tables and more.",
    keywords: [
      "markdown previewer",
      "markdown editor",
      "markdown live preview",
      "md to html",
      "markdown viewer",
      "markdown tester",
    ],
    howTo: [
      { title: "Type Markdown", text: "Write in the left panel - or load the sample to see what is supported." },
      { title: "Watch the preview", text: "The right panel renders your formatting live as you type." },
      { title: "Copy or clear", text: "Use the toolbar buttons to copy your Markdown or start fresh." },
    ],
    features: [
      "Live side-by-side preview",
      "Headings, bold, italic, strikethrough",
      "Code blocks and inline code",
      "Lists, blockquotes and tables",
      "Links rendered as clickable links",
      "Safe rendering - raw HTML is escaped, never executed",
    ],
    faqs: [
      {
        question: "Is my Markdown sent to a server?",
        answer:
          "No. Rendering happens entirely in your browser with a small built-in parser. Nothing you type leaves your device.",
      },
      {
        question: "Why is my HTML shown as text instead of rendering?",
        answer:
          "That is deliberate. The previewer escapes raw HTML so pasted content can never run scripts or break the page. It is a safety feature, not a bug.",
      },
      {
        question: "Which Markdown features are supported?",
        answer:
          "Headings, bold, italic, strikethrough, inline code, fenced code blocks, links, images, unordered and ordered lists (including nested lists and task-list checkboxes), blockquotes, horizontal rules, simple tables and footnotes.",
      },
      {
        question: "Can I export the preview?",
        answer:
          "You can copy your Markdown source or the rendered HTML with the toolbar buttons, or download either as a .md or .html file. To keep the rendered look, print the page to PDF from your browser's print dialog.",
      },
    ],
    related: ["json-formatter", "regex-tester", "base64", "url-encoder-decoder"],
  },

  // ══════════════════════ POMODORO TIMER ══════════════════════
  {
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    description:
      "A Pomodoro focus timer with customizable session lengths, cycle tracking, a built-in task list and an end-of-session beep.",
    category: "Calculators",
    hub: "/calculators",
    title: "Pomodoro Timer - Free Focus Timer With Task List | BeYourTools",
    metaDescription:
      "Free Pomodoro timer with customizable focus, short-break and long-break sessions, a cycle counter, a task list saved in your browser, and a tab countdown. No sign-up.",
    tagline:
      "Work in focused bursts and rest properly. Set your session lengths, press start, and let the timer count your cycles while you check off tasks.",
    keywords: [
      "pomodoro timer",
      "focus timer",
      "pomodoro technique",
      "productivity timer",
      "study timer",
      "work timer",
      "25 minute timer",
      "online pomodoro timer",
    ],
    howTo: [
      { title: "Set your durations", text: "Pick focus, short-break and long-break lengths, plus how many focus sessions run before a long break. The defaults are the classic 25 / 5 / 15." },
      { title: "Add your tasks", text: "Type tasks into the list and tick them off as you finish. Everything is saved on your device automatically." },
      { title: "Start a session", text: "Press start and get to work. The remaining time shows in the browser tab title, so you can glance at it from any tab." },
      { title: "Rest when it beeps", text: "A short beep marks the end of each session, and the timer moves you into the right break automatically." },
    ],
    features: [
      "Focus, short-break and long-break modes with custom lengths",
      "Cycle counter showing completed Pomodoros",
      "Task list with check-off, delete and automatic saving",
      "Live countdown in the browser tab title",
      "Optional end-of-session beep generated with Web Audio",
      "Automatic switching between focus and break sessions",
    ],
    faqs: [
      {
        question: "What is the Pomodoro Technique?",
        answer: "It is a time-management method: work in focused 25-minute sessions (Pomodoros), take a 5-minute break, and after four sessions take a longer 15 to 30 minute break. The structure fights fatigue and makes big tasks feel manageable.",
      },
      {
        question: "Why 25 minutes?",
        answer: "Twenty-five minutes is long enough to get into a flow state but short enough that your attention rarely collapses first. If your work needs longer stretches, raise the focus length in the settings. The technique still works.",
      },
      {
        question: "Does the timer keep running if I switch tabs?",
        answer: "Yes. The timer is anchored to the clock time it should finish, not to a per-second counter, so it stays accurate even when the tab is in the background or your laptop sleeps briefly.",
      },
      {
        question: "Where are my tasks stored?",
        answer: "In your browser's local storage, on your device only. They are never uploaded anywhere, so they persist between visits on the same browser but cannot follow you to another device.",
      },
      {
        question: "Can I change durations in the middle of a session?",
        answer: "Yes. If the timer is not running, the current session resets to the new length immediately. If it is running, the new lengths apply from the next session.",
      },
    ],
    related: ["percentage-calculator", "age-calculator", "word-counter", "timestamp-converter"],
  },
  // ══════════════════════ RANDOM NUMBER GENERATOR ══════════════════════
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    description:
      "Generate random numbers in any range with crypto-grade randomness. Set the count, allow or block duplicates, and sort the results.",
    category: "Calculators",
    hub: "/calculators",
    title: "Random Number Generator - Secure Random Numbers | BeYourTools",
    metaDescription:
      "Free random number generator using crypto-grade randomness. Set any range, pick the count, allow or forbid duplicates, and sort results. Runs in your browser.",
    tagline:
      "Need a fair pick? Set a range, draw as many numbers as you want, and know every result comes from your browser's cryptographic random source.",
    keywords: [
      "random number generator",
      "random number picker",
      "secure random number",
      "random integer generator",
      "raffle number picker",
      "random draw tool",
      "number picker wheel",
      "crypto random",
    ],
    howTo: [
      { title: "Set the range", text: "Enter a minimum and maximum. Both ends are included, so 1 to 100 can return 1 or 100." },
      { title: "Choose how many", text: "Type how many numbers to draw. Each one is generated independently." },
      { title: "Pick your options", text: "Turn off duplicates for draws with no repeats, and turn on sorting for an ordered list." },
      { title: "Draw and copy", text: "Press Generate and copy the results with one click for pasting elsewhere." },
    ],
    features: [
      "Uses crypto.getRandomValues, never Math.random",
      "Any integer range, both endpoints included",
      "Optional no-duplicates mode for unique draws",
      "Optional ascending sort of results",
      "One-click copy of the full result list",
      "Draws up to 1,000 numbers per click",
    ],
    faqs: [
      {
        question: "How random is this really?",
        answer: "Every number comes from crypto.getRandomValues, the operating system's cryptographically secure random source, with rejection sampling to remove modulo bias. That is the same source used for password and key generation, far stronger than Math.random.",
      },
      {
        question: "What happens if I ask for more unique numbers than the range holds?",
        answer: "You get a clear message instead of bad output. For example, asking for 10 unique numbers between 1 and 5 is impossible, so the tool asks you to widen the range or allow duplicates.",
      },
      {
        question: "Can I use this for a raffle or giveaway?",
        answer: "For informal draws among friends, clubs or classrooms, yes. For regulated lotteries or gambling, no: those need certified, audited systems and often witnessed draws.",
      },
      {
        question: "How large a range can I use?",
        answer: "Any range that fits in a 32-bit integer, roughly from -2.1 billion to +2.1 billion. That covers practically any everyday need.",
      },
      {
        question: "Are the results sent anywhere?",
        answer: "No. Generation happens entirely in your browser. Nothing is logged, stored or transmitted.",
      },
    ],
    related: ["uuid-generator", "password-generator", "percentage-calculator", "hash-generator"],
  },
  // ══════════════════════ SCIENTIFIC CALCULATOR ══════════════════════
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    description:
      "A scientific calculator with trig, logarithms, powers, square root and constants, a real expression parser, calculation history and full keyboard support.",
    category: "Calculators",
    hub: "/calculators",
    title: "Scientific Calculator - Free Online With History | BeYourTools",
    metaDescription:
      "Free online scientific calculator: trig, log, ln, powers, square root, factorial, pi and e constants, Ans key, calculation history and keyboard support. Safe expression parser, no eval.",
    tagline:
      "Type or tap a full expression and get the answer instantly, with trig, logs, powers and constants, a history of everything you calculated, and proper order of operations.",
    keywords: [
      "scientific calculator",
      "online calculator",
      "trig calculator",
      "log calculator",
      "square root calculator",
      "calculator with history",
      "exponent calculator",
      "math expression evaluator",
    ],
    howTo: [
      { title: "Type or click", text: "Enter an expression like sin(30)+2^3 with your keyboard, or build it with the button pad." },
      { title: "Use functions", text: "sin, cos, tan, log, ln, sqrt, factorial and the pi and e constants all work. Toggle degrees or radians for trig." },
      { title: "Press Enter or =", text: "The answer appears below the expression. Press Ans in the next calculation to reuse the last result." },
      { title: "Review history", text: "Every calculation is kept in the history list. Click any entry to reload it into the input." },
    ],
    features: [
      "Real tokenizer and parser, never eval()",
      "Trig, inverse trig, log, ln, powers, roots, factorial",
      "Pi and e constants plus implicit multiplication (2pi)",
      "Degrees and radians modes",
      "Ans key reuses the previous result",
      "Click any history entry to reuse it",
      "Full keyboard support including Backspace and Enter",
    ],
    faqs: [
      {
        question: "Is this calculator safe to use?",
        answer: "Yes. It parses your expression with a purpose-built tokenizer and grammar, so there is no eval or Function constructor that could run arbitrary code. What you type is treated purely as math.",
      },
      {
        question: "Degrees or radians?",
        answer: "Both. The DEG/RAD toggle switches how sin, cos and tan interpret their input. Inverse functions (asin, acos, atan) return angles in the currently selected unit.",
      },
      {
        question: "What does the % button do?",
        answer: "It is a postfix percent operator: 50% becomes 0.5. So 200+10% evaluates to 201, and 10% of 200 is written 200*10%.",
      },
      {
        question: "How is exponentiation handled?",
        answer: "The ^ operator is right-associative with higher precedence than multiplication, so 2^3^2 means 2^(3^2) = 512, matching standard math notation.",
      },
      {
        question: "What is the Ans key for?",
        answer: "Ans inserts the result of your last calculation. It is handy for chaining: compute a value, then use it in the next expression without retyping.",
      },
    ],
    related: ["percentage-calculator", "bmi-calculator", "age-calculator", "timestamp-converter"],
  },
  // ══════════════════════ TIMEZONE CONVERTER ══════════════════════
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description:
      "Convert a date and time between any time zones, build a custom list of target zones, and check a live world clock of major cities.",
    category: "Calculators",
    hub: "/calculators",
    title: "Timezone Converter - Convert Time Between Zones | BeYourTools",
    metaDescription:
      "Free timezone converter: enter a date and time, convert it across any time zones with automatic DST handling, and browse a live world clock of 12 major cities. No sign-up.",
    tagline:
      "Scheduling across borders? Pick a date, a source zone and your target zones, and get every conversion with daylight saving handled automatically.",
    keywords: [
      "timezone converter",
      "time zone converter",
      "world clock",
      "convert time zones",
      "meeting time converter",
      "gmt converter",
      "utc converter",
      "time difference calculator",
    ],
    howTo: [
      { title: "Enter your date and time", text: "Use the date-time picker, or leave it on now. Then choose which time zone that moment belongs to." },
      { title: "Add target zones", text: "Add any zones you care about from the list: offices, family, clients. Remove them just as easily." },
      { title: "Read the results", text: "Each zone shows the converted local time with its UTC offset, daylight saving already accounted for." },
      { title: "Glance at the world clock", text: "The bottom panel shows the current time in 12 major cities, ticking live." },
    ],
    features: [
      "Convert between any IANA time zones",
      "Automatic daylight saving adjustments via Intl",
      "Add and remove unlimited target zones",
      "Live world clock for 12 major cities",
      "UTC offset shown for every conversion",
      "Works fully offline in your browser",
    ],
    faqs: [
      {
        question: "How does it handle daylight saving time?",
        answer: "Through the browser's built-in Intl timezone database, which tracks historical and upcoming DST rules for every zone. You never need to know when a region switches; the converted times are already correct.",
      },
      {
        question: "Why did a converted time shift by an hour compared to last month?",
        answer: "One of the zones entered or left daylight saving. The converter reflects the rules in effect on the specific date you entered, which is exactly why it beats a fixed offset chart.",
      },
      {
        question: "Which time zones are supported?",
        answer: "All IANA time zones your browser knows, which is several hundred, covering every inhabited region. If a zone is missing, your browser's timezone data is outdated; updating the browser fixes it.",
      },
      {
        question: "Does the world clock update in real time?",
        answer: "Yes, every second. It is the same Intl data as the converter, so what you see matches the conversions exactly.",
      },
      {
        question: "Is an internet connection required?",
        answer: "No. Everything uses data already in your browser. Once the page is loaded, you can convert times with the network off.",
      },
    ],
    related: ["timestamp-converter", "age-calculator", "bmi-calculator", "percentage-calculator"],
  },
  // ══════════════════════ META TAG GENERATOR ══════════════════════
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description:
      "Generate SEO meta tags, Open Graph and Twitter Card markup from a simple form, with a live Google SERP preview and character counters.",
    category: "Developer Tools",
    hub: "/developer-tools",
    title: "Meta Tag Generator - SEO & Social Tags | BeYourTools",
    metaDescription:
      "Free meta tag generator: build SEO title and description, Open Graph and Twitter Card tags from a form, preview the Google SERP result live, and copy clean HTML.",
    tagline:
      "Fill in a form, get clean meta tags. Watch a live Google-style preview as you type, with character counters that warn you before you get truncated.",
    keywords: [
      "meta tag generator",
      "seo meta tags",
      "open graph generator",
      "twitter card generator",
      "meta description generator",
      "og tags generator",
      "serp preview",
      "html meta tags",
    ],
    howTo: [
      { title: "Fill in the form", text: "Enter your title, description, keywords, author, robots rules, canonical URL and social fields." },
      { title: "Watch the preview", text: "The Google-style result updates as you type. Title turns red past ~60 characters, description past ~160." },
      { title: "Set social cards", text: "Choose a Twitter card type and add your Open Graph image URL for rich link previews." },
      { title: "Copy the HTML", text: "One click copies all generated tags, ready to paste into your page's head section." },
    ],
    features: [
      "SEO title, description, keywords, author and robots tags",
      "Open Graph tags for Facebook and LinkedIn previews",
      "Twitter Card tags with card-type selector",
      "Live Google SERP preview with truncation warnings",
      "Character counters: ~60 for title, ~160 for description",
      "Proper HTML escaping of every value",
      "One-click copy of the generated markup",
    ],
    faqs: [
      {
        question: "Which meta tags actually matter for SEO?",
        answer: "The title tag and meta description. The title is a ranking factor and the headline of your search result; the description does not directly rank you but controls the snippet people read before clicking, which affects click-through rate.",
      },
      {
        question: "Are meta keywords still useful?",
        answer: "No major search engine uses them for ranking, and Google ignores them entirely. The generator includes them only because some internal site-search tools still read them.",
      },
      {
        question: "What does the Open Graph image do?",
        answer: "It is the image shown when your page is shared on Facebook, LinkedIn, Slack, Discord and most messaging apps. Without og:image, platforms pick an image at random, or none. Use a 1200x630 image for best results.",
      },
      {
        question: "Which Twitter card type should I choose?",
        answer: "summary_large_image for articles and landing pages with a strong visual; summary for compact cards like a profile or utility page. The large card gets noticeably more engagement on link shares.",
      },
      {
        question: "What should the canonical URL be?",
        answer: "The single preferred URL of the page, absolute and including https. It tells search engines which version to index when similar content exists at multiple addresses, preventing duplicate-content issues.",
      },
    ],
    related: ["url-encoder-decoder", "hash-generator", "regex-tester", "password-generator"],
  },
];
export function getGeneralTool(slug: string): GeneralTool | undefined {
  return generalTools.find((t) => t.slug === slug);
}

export function generalToolsByCategory(category: GeneralToolCategory): GeneralTool[] {
  return generalTools.filter((t) => t.category === category);
}

export function relatedGeneralTools(slug: string, max = 4): GeneralTool[] {
  const tool = getGeneralTool(slug);
  if (!tool) return [];
  return tool.related
    .map((s) => getGeneralTool(s))
    .filter((t): t is GeneralTool => Boolean(t))
    .slice(0, max);
}
