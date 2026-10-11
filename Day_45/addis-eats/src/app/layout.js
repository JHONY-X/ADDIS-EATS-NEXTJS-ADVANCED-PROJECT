import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { getSession } from "@/lib/session";
import SignOutButton from "./SignOutButton";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Addis Eats",
    default: "Addis Eats | Food delivery in Addis Ababa",
  },
  description: "Discover satisfying dishes and order food delivery across Addis Ababa with Addis Eats.",
  openGraph: {
    type: "website",
    locale: "en_ET",
    url: SITE_URL,
    siteName: "Addis Eats",
    title: "Addis Eats | Ethiopian food delivery",
    description: "Discover freshly prepared local favourites from trusted kitchens across Addis Ababa.",
    images: [
      {
        url: `${SITE_URL}/og-homepage.png`,
        secureUrl: `${SITE_URL}/og-homepage.png`,
        width: 1870,
        height: 915,
        type: "image/png",
        alt: "Addis Eats food delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats | Ethiopian food delivery",
    description: "Discover freshly prepared local favourites from trusted kitchens across Addis Ababa.",
    images: [`${SITE_URL}/og-homepage.png`],
  },
};
const analyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const dynamic = "force-dynamic";



export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="site-header">
            <Link className="brand" href="/">Addis Eats</Link>
            <nav aria-label="Main navigation">
              <Link href="/menu">Menu</Link>
              <Link href="/checkout">Checkout</Link>
              {session?.role === "staff" && <Link href="/kitchen">Kitchen</Link>}
              {session ? (
                <>
                  <span className="nav-user">👤 {session.name}</span>
                  <SignOutButton />
                </>
              ) : (
                <Link href="/signin">Sign In</Link>
              )}
            </nav>
          </header>
          {children}
          <footer className="site-footer">© 2026 Addis Eats · Made with Ethiopian flavour</footer>
        </Providers>

        {analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
