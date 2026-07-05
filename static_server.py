#!/usr/bin/env python3
"""Static server that resolves wget-style asset filenames with query strings."""

import mimetypes
import os
from functools import partial
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

ROOT = os.environ.get("SITE_ROOT", "/workspace/purebredkitties-website")
PORT = int(os.environ.get("SITE_PORT", "8082"))


def candidate_paths(url_path: str, query: str) -> list[str]:
    rel = unquote(url_path.lstrip("/"))
    if not rel or rel.endswith("/"):
        rel = rel + "index.html" if rel else "index.html"

    paths = []
    if query:
        paths.append(os.path.join(ROOT, f"{rel}?{query}"))
        paths.append(os.path.join(ROOT, f"{rel}?{query.split('&')[0]}"))
        ext = os.path.splitext(rel)[1]
        if ext:
            paths.append(os.path.join(ROOT, f"{rel}?{query}{ext}"))

    paths.append(os.path.join(ROOT, rel))

    # Shopify-style URLs without .html extension
    if not rel.endswith(".html"):
        paths.append(os.path.join(ROOT, rel + ".html"))

    # Directory index fallback
    if os.path.isdir(os.path.join(ROOT, rel)):
        paths.append(os.path.join(ROOT, rel, "index.html"))

    # Unique while preserving order
    seen = set()
    unique = []
    for path in paths:
        if path not in seen:
            seen.add(path)
            unique.append(path)
    return unique


def resolve_file(url_path: str, query: str) -> str | None:
    for path in candidate_paths(url_path, query):
        if os.path.isfile(path):
            return path
    return None


class SiteHandler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self._serve(send_body=False)

    def do_GET(self):
        self._serve(send_body=True)

    def _serve(self, send_body: bool):
        parsed = urlparse(self.path)
        file_path = resolve_file(parsed.path, parsed.query)
        if not file_path:
            self.send_error(404, "File not found")
            return

        ctype = mimetypes.guess_type(file_path.split("?")[0])[0] or "application/octet-stream"
        try:
            with open(file_path, "rb") as handle:
                data = handle.read()
        except OSError:
            self.send_error(404, "File not found")
            return

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        if send_body:
            self.wfile.write(data)

    def log_message(self, format, *args):
        if str(args[1]) != "200":
            super().log_message(format, *args)


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), SiteHandler)
    print(f"Serving {ROOT} on port {PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
