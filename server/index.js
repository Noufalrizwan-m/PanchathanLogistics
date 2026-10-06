const http = require('node:http');
const { createInquiryHandler } = require('./inquiry');
const inquiry = createInquiryHandler();
const port = Number(process.env.INQUIRY_PORT || 3001);
const server = http.createServer((req,res) => {
  if (req.url === '/api/inquiry') return inquiry(req,res);
  res.writeHead(404, {'Content-Type':'application/json'});
  res.end(JSON.stringify({success:false,message:'Not found'}));
});
server.listen(port, '127.0.0.1', () => console.log(`Inquiry service listening on port ${port}. Delivery ${process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD ? 'configured' : 'requires server credentials'}.`));
