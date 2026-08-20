import Link from "next/link";

const TOOL_LINKS = {
  "JSON Tools": [
    { href: "/json-tools",            label: "All JSON Tools"    },
    { href: "/json-formatter",        label: "JSON Formatter"    },
    { href: "/json-validator",        label: "JSON Validator"    },
    { href: "/json-diff",             label: "JSON Diff"         },
    { href: "/json-schema-generator", label: "Schema Generator"  },
    { href: "/jwt-decoder",           label: "JWT Decoder"       },
  ],
  "Image Converter": [
    { href: "/image-converter",                    label: "All Converters" },
    { href: "/image-converter/jpg-to-png",         label: "JPG to PNG"     },
    { href: "/image-converter/png-to-jpg",         label: "PNG to JPG"     },
    { href: "/image-converter/jpg-to-webp",        label: "JPG to WebP"    },
    { href: "/image-converter/jpg-to-pdf",         label: "JPG to PDF"     },
    { href: "/image-converter/svg-to-png",         label: "SVG to PNG"     },
  ],
  "PDF Tools": [
    { href: "/pdf-tools",                 label: "All PDF Tools"  },
    { href: "/pdf-tools/pdf-to-jpg",      label: "PDF to JPG"     },
    { href: "/pdf-tools/merge-pdf",       label: "Merge PDF"      },
    { href: "/pdf-tools/split-pdf",       label: "Split PDF"      },
    { href: "/pdf-tools/pdf-compressor",  label: "Compress PDF"   },
    { href: "/pdf-tools/protect-pdf",     label: "Protect PDF"    },
  ],
  "QR & Barcodes": [
    { href: "/qr-barcode-tools",           label: "All QR & Barcode Tools" },
    { href: "/qr-code-generator",          label: "QR Code Generator"      },
    { href: "/wifi-qr-code-generator",     label: "WiFi QR Generator"      },
    { href: "/barcode-generator",          label: "Barcode Generator"      },
    { href: "/upc-barcode-generator",      label: "UPC Generator"          },
    { href: "/ean-barcode-generator",      label: "EAN-13 Generator"       },
  ],
  "Audio Tools": [
    { href: "/audio-tools",        label: "All Audio Tools"   },
    { href: "/mp3-converter",      label: "MP3 Converter"     },
    { href: "/mp3-cutter",         label: "MP3 Cutter"        },
    { href: "/mp4-to-mp3",         label: "MP4 to MP3"        },
    { href: "/mp3-compressor",     label: "MP3 Compressor"    },
    { href: "/audio-recorder",     label: "Audio Recorder"    },
  ],
  "Blog": [
    { href: "/blog",                                               label: "All Articles"         },
    { href: "/blog/json-tips-every-developer-should-know",        label: "10 JSON Tips"          },
    { href: "/blog/image-formats-explained-jpg-png-webp-avif",    label: "Image Formats Guide"   },
    { href: "/blog/pdf-tools-guide-merge-split-compress",         label: "PDF Tools Guide"       },
    { href: "/blog/json-schema-beginners-guide",                  label: "JSON Schema Guide"     },
    { href: "/blog/jwt-explained-what-developers-need-to-know",   label: "JWTs Explained"        },
  ],
};

const POLICY_LINKS = [
  { href: "/about",          label: "About" },
  { href: "/contact",        label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms",          label: "Terms & Conditions" },
  { href: "/cookie-policy",  label: "Cookie Policy" },
  { href: "/disclaimer",     label: "Disclaimer" },
];

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top: brand + link columns */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)" }}
              >
                B
              </span>
              <span className="font-display text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                BeYourTools
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
              Free, private, browser-based tools for developers and designers. Nothing is uploaded to a server.
            </p>
            {/* <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {POLICY_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring rounded text-[11px] transition hover-text-primary"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {label}
                </Link>
              ))}
            </div> */}
          </div>

          {/* Tool link columns */}
          {Object.entries(TOOL_LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h3
                className="mb-3 text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-subtle)" }}
              >
                {heading}
              </h3>
              <ul className="space-y-1.5">
                {items.map(({ href, label }) => (
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
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
        >
          <span>© {new Date().getFullYear()} BeYourTools. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span>All tools run 100% in your browser</span>
            </div>
            {/* Bottom policy row */}
            <div className="flex items-center gap-3">
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
