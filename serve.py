import http.server
import socketserver
import webbrowser
import os

PORT = 8000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}")
    httpd.serve_forever()
