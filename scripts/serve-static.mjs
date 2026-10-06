// Test-only static server. Avoids serve CLI's network-interface discovery.
import http from 'node:http';
import handler from 'serve-handler';
const port = Number(process.argv[2] ?? 4321);
const server = http.createServer((request, response) => handler(request, response, { public: 'out', cleanUrls: true }));
server.listen(port, '127.0.0.1', () => console.log(`Static export listening on ${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
