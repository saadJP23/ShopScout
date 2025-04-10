# generate_sitemap.py

from datetime import date

urls = [
    "/", "/about", "/contact", "/shop", "/cart", "/checkout", "/success",
    "/privacy", "/help", "/track", "/login", "/register", "/reset-password",
    "/terms-and-condition"
]

base_url = "https://www.yourdomain.com"  # change to your actual deployed domain
today = date.today()

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')

    for path in urls:
        f.write("  <url>\n")
        f.write(f"    <loc>{base_url}{path}</loc>\n")
        f.write(f"    <lastmod>{today}</lastmod>\n")
        f.write("    <priority>0.8</priority>\n")
        f.write("  </url>\n")

    f.write("</urlset>")
