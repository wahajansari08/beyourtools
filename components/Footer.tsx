import Link from "next/link";

// ── Social links ──────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href:  "https://www.facebook.com/people/Be-Your-Tools/61593827195970/",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href:  "https://x.com/BeYourTools",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    href:  "https://www.reddit.com/user/beyourtools/",
    icon:  (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
];

// ── 8 tool columns ────────────────────────────────────────────────────────────
// Row 1 cols 2-5: JSON Tools | Image Converter | PDF Tools | Audio Tools
// Row 2 cols 2-5: Video Tools | QR & Barcodes | Finance Tools | Blog & Pages

const COL_JSON = {
  heading: "JSON Tools",
  href: "/json-tools",
  links: [
    { href: "/json-tools",              label: "All JSON Tools"      },
    { href: "/json-formatter",          label: "JSON Formatter"      },
    { href: "/json-validator",          label: "JSON Validator"      },
    { href: "/json-diff",               label: "JSON Diff"           },
    { href: "/json-schema-generator",   label: "Schema Generator"    },
    { href: "/jwt-decoder",             label: "JWT Decoder"         },
    { href: "/json-to-csv",             label: "JSON to CSV"         },
    { href: "/json-repair",             label: "JSON Repair"         },
  ],
};

const COL_IMAGE = {
  heading: "Image Converter",
  href: "/image-converter",
  links: [
    { href: "/image-converter",             label: "All Converters" },
    { href: "/image-converter/jpg-to-png",  label: "JPG to PNG"     },
    { href: "/image-converter/png-to-jpg",  label: "PNG to JPG"     },
    { href: "/image-converter/jpg-to-webp", label: "JPG to WebP"    },
    { href: "/image-converter/jpg-to-pdf",  label: "JPG to PDF"     },
    { href: "/image-converter/svg-to-png",  label: "SVG to PNG"     },
    { href: "/image-converter/png-to-webp", label: "PNG to WebP"    },
    { href: "/image-converter/webp-to-jpg", label: "WebP to JPG"    },
  ],
};

const COL_PDF = {
  heading: "PDF Tools",
  href: "/pdf-tools",
  links: [
    { href: "/pdf-tools",                label: "All PDF Tools"  },
    { href: "/pdf-tools/merge-pdf",      label: "Merge PDF"      },
    { href: "/pdf-tools/split-pdf",      label: "Split PDF"      },
    { href: "/pdf-tools/pdf-compressor", label: "Compress PDF"   },
    { href: "/pdf-tools/pdf-to-jpg",     label: "PDF to JPG"     },
    { href: "/pdf-tools/protect-pdf",    label: "Protect PDF"    },
    { href: "/pdf-tools/rotate-pdf",     label: "Rotate PDF"     },
    { href: "/pdf-tools/pdf-to-text",    label: "PDF to Text"    },
  ],
};

const COL_AUDIO = {
  heading: "Audio Tools",
  href: "/audio-tools",
  links: [
    { href: "/audio-tools",       label: "All Audio Tools"  },
    { href: "/mp3-converter",     label: "MP3 Converter"    },
    { href: "/audio-converter",   label: "Audio Converter"  },
    { href: "/mp3-cutter",        label: "MP3 Cutter"       },
    { href: "/mp3-compressor",    label: "MP3 Compressor"   },
    { href: "/mp3-merger",        label: "MP3 Merger"       },
    { href: "/audio-recorder",    label: "Audio Recorder"   },
    { href: "/mp4-to-mp3",        label: "MP4 to MP3"       },
  ],
};

const COL_VIDEO = {
  heading: "Video Tools",
  href: "/video-tools",
  links: [
    { href: "/video-tools",                label: "All Video Tools"  },
    { href: "/video-compressor",           label: "Video Compressor" },
    { href: "/video-cutter",               label: "Video Cutter"     },
    { href: "/video-converter",            label: "Video Converter"  },
    { href: "/video-to-gif",               label: "Video to GIF"     },
    { href: "/video-thumbnail-generator",  label: "Thumbnail Maker"  },
    { href: "/video-resizer",              label: "Video Resizer"    },
    { href: "/remove-audio-from-video",    label: "Remove Audio"     },
  ],
};

const COL_QR = {
  heading: "QR & Barcodes",
  href: "/qr-barcode-tools",
  links: [
    { href: "/qr-barcode-tools",          label: "All QR & Barcodes"  },
    { href: "/qr-code-generator",         label: "QR Code Generator"  },
    { href: "/qr-code-generator-with-logo", label: "QR with Logo"     },
    { href: "/wifi-qr-code-generator",    label: "WiFi QR Generator"  },
    { href: "/qr-code-scanner",           label: "QR Code Scanner"    },
    { href: "/barcode-generator",         label: "Barcode Generator"  },
    { href: "/upc-barcode-generator",     label: "UPC Generator"      },
    { href: "/ean-barcode-generator",     label: "EAN-13 Generator"   },
  ],
};

const COL_FINANCE = {
  heading: "Finance Tools",
  href: "/finance-tools",
  links: [
    { href: "/finance-tools",                  label: "All Finance Tools"  },
    { href: "/loan-payment-calculator",        label: "Loan Payment"       },
    { href: "/profit-margin-calculator",       label: "Profit Margin"      },
    { href: "/savings-calculator",             label: "Savings Calculator" },
    { href: "/roi-calculator",                 label: "ROI Calculator"     },
    { href: "/debt-snowball-calculator",       label: "Debt Snowball"      },
    { href: "/credit-card-payoff-calculator",  label: "Credit Card Payoff" },
    { href: "/hourly-to-salary-calculator",    label: "Hourly to Salary"   },
  ],
};

const COL_BLOG = {
  heading: "Blog & Pages",
  href: "/blog",
  links: [
    { href: "/blog",                                             label: "All Articles"        },
    { href: "/blog/json-tips-every-developer-should-know",       label: "10 JSON Tips"        },
    { href: "/blog/image-formats-explained-jpg-png-webp-avif",   label: "Image Formats Guide" },
    { href: "/blog/pdf-tools-guide-merge-split-compress",        label: "PDF Tools Guide"     },
    { href: "/about",                                            label: "About"               },
    { href: "/contact",                                          label: "Contact"             },
    { href: "/privacy-policy",                                   label: "Privacy Policy"      },
    { href: "/terms",                                            label: "Terms"               },
  ],
};

// Row groupings
const ROW1_COLS = [COL_JSON, COL_IMAGE, COL_PDF, COL_AUDIO];
const ROW2_COLS = [COL_VIDEO, COL_QR, COL_FINANCE, COL_BLOG];

const POLICY_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms",          label: "Terms"           },
  { href: "/cookie-policy",  label: "Cookie Policy"   },
  { href: "/disclaimer",     label: "Disclaimer"      },
];

// ── Reusable link column ──────────────────────────────────────────────────────

function LinkColumn({ col }: { col: typeof COL_JSON }) {
  return (
    <div className="flex flex-col items-start">
      <h3
        className="mb-3 text-[11px] font-semibold uppercase tracking-wide"
        style={{ color: "var(--text-subtle)" }}
      >
        {col.heading}
      </h3>
      <ul className="space-y-1.5">
        {col.links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="focus-ring rounded text-xs transition hover-text-primary"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        {/* ── Row 1: Brand info + 4 tool columns ──────────────────────────
            Mobile  : 2 cols (brand spans both), centred
            Tablet  : 2 cols
            Desktop : 5 cols  [brand | json | image | pdf | audio]
        ─────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 text-center sm:text-left lg:grid-cols-5 lg:gap-8">

          {/* Brand / info — spans both cols on mobile, single col on desktop */}
          <div className="col-span-2 flex flex-col items-center sm:col-span-1 sm:items-start lg:col-span-1">
            <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded">
              <span className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                BeYourTools
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
              Free, private, browser-based tools for everyone. Nothing is ever uploaded to a server.
            </p>
            {/* Social icons */}
            <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`BeYourTools on ${label}`}
                  className="focus-ring flex h-7 w-7 items-center justify-center rounded-md border transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border-strong)",
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-muted)",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Row 1 tool columns */}
          {ROW1_COLS.map((col) => (
            <LinkColumn key={col.heading} col={col} />
          ))}
        </div>

        {/* ── Divider between rows ─────────────────────────────────────── */}
        <div className="my-8 h-px" style={{ backgroundColor: "var(--border)" }} />

        {/* ── Row 2: Blank space + 4 tool columns ─────────────────────────
            Mobile  : 2 cols (blank hidden)
            Tablet  : 2 cols
            Desktop : 5 cols  [blank | video | qr | finance | blog]
        ─────────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-8 text-center sm:text-left lg:grid-cols-5 lg:gap-8">

          {/* Blank first column on desktop — hidden on mobile/tablet */}
          <div className="hidden lg:block" aria-hidden="true" />

          {/* Row 2 tool columns */}
          {ROW2_COLS.map((col) => (
            <LinkColumn key={col.heading} col={col} />
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────
            Mobile : stacked, centred
            Desktop: side-by-side
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="mt-8 flex flex-col items-center gap-4 border-t pt-6 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left"
          style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
        >
          <span>© {new Date().getFullYear()} BeYourTools. All rights reserved.</span>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" />
              <span>All tools run 100% in your browser</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {POLICY_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring rounded hover-text-primary transition"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
