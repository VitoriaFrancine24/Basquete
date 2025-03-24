import http.server
import socketserver
import json
import socket
from urllib.parse import urlparse, parse_qs
from nba_data import search_players

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/search_player'):
            query = parse_qs(parsed_path.query).get('query', [''])[0]
            if query:
                results = search_players(query)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(results).encode())
                return
            else:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Query parameter is required'}).encode())
                return
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

if __name__ == "__main__":
    PORT = 8000
    local_ip = get_local_ip()
    
    # Configurar o servidor para aceitar conexões de qualquer interface
    with socketserver.TCPServer(("0.0.0.0", PORT), RequestHandler) as httpd:
        print(f"\nServidor NBA Dashboard rodando!")
        print(f"\nVocê pode acessar usando qualquer um destes links:")
        print(f"→ http://{local_ip}:{PORT}")
        print(f"→ http://localhost:{PORT}")
        print(f"\nPara acessar de outros dispositivos na mesma rede Wi-Fi, use:")
        print(f"→ http://{local_ip}:{PORT}")
        print("\nPressione Ctrl+C para parar o servidor.")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor parado.")
            httpd.server_close()