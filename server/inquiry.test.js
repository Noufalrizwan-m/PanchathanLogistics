const test = require('node:test');
const assert = require('node:assert/strict');
const { createInquiryHandler, validateInquiry } = require('./inquiry');
const valid = {name:'Review Test',email:'review@example.com',phone:'+91 73394 33590',service:'Air Freight',message:'Please quote for a sample shipment.',submissionId:'test-submission-12345'};
function response() { return { headers:{},setHeader(k,v){this.headers[k]=v;},end(value){this.body=JSON.parse(value);} }; }
function request(body=valid, extras={}) { return {method:'POST',headers:{'content-type':'application/json',origin:'http://localhost:3000'},socket:{remoteAddress:'127.0.0.1'},body,...extras}; }
const env={GMAIL_USER:'sales.panchathanlogistics@gmail.com',GMAIL_APP_PASSWORD:'test-app-password'};
test('international numbers of different lengths are validated and normalized',()=>{
 for(const [phone,expected] of [
  ['+91 73394 33590','+917339433590'],['+971 50 123 4567','+971501234567'],
  ['+44 20 7946 0018','+442079460018'],['+1 (202) 555-0123','+12025550123'],
  ['+65 8123 4567','+6581234567'],['+49 30 123456','+4930123456'],
 ]) assert.equal(validateInquiry({...valid,phone}).phone,expected);
 for(const phone of ['+91 1234567','+971 50123456789','+999 123456789','Call 7339433590','+1 2025550123 ext. 4']) {
  assert.throws(()=>validateInquiry({...valid,phone}),/valid phone number/);
 }
});
test('inquiries use fixed business recipients, customer reply-to, and stable retry keys',async()=>{
 const calls=[];
 const handler=createInquiryHandler({env,transport:{sendMail:async(payload)=>{calls.push(payload);return {messageId:'email-reference',accepted:['info@panchathanlogistics.com','sales.panchathanlogistics@gmail.com']};}}});
 const one=response(); await handler(request({...valid,to:'attacker@example.com'}),one);
 const two=response(); await handler(request({...valid,to:'attacker@example.com'}),two);
 assert.equal(one.statusCode,200);assert.equal(one.body.reference,'email-reference');
 const payload=calls[0];
 assert.deepEqual(payload.to,['info@panchathanlogistics.com','sales.panchathanlogistics@gmail.com']);
 assert.equal(payload.replyTo,valid.email); assert.equal(payload.from.address,env.GMAIL_USER);
 assert.equal(calls.length,1);
});
test('missing credentials fail honestly without sending',async()=>{
 const handler=createInquiryHandler({env:{},transport:{sendMail:()=>{throw new Error('should not send');}}});
 const res=response();await handler(request(),res);assert.equal(res.statusCode,503);assert.equal(res.body.success,false);
});
test('invalid fields, header injection, and honeypot are rejected before delivery',async()=>{
 let sends=0;const handler=createInquiryHandler({env,transport:{sendMail:async()=>{sends++;}}});
 for(const body of [{...valid,email:'invalid'},{...valid,name:'Alice\r\nBcc: other@example.com'},{...valid,website:'spam'},{...valid,message:'x'.repeat(5001)}]) {
 const res=response();await handler(request(body),res);assert.equal(res.statusCode,400);
 } assert.equal(sends,0);
});

test('empty or short optional messages are accepted and an empty message is clear in the email',async()=>{
 const calls=[];
 const handler=createInquiryHandler({env,transport:{sendMail:async payload=>{calls.push(payload);return {messageId:'optional-message',accepted:['info@panchathanlogistics.com','sales.panchathanlogistics@gmail.com']};}}});
 for(const message of ['', 'Hi']) {
  const res=response();await handler(request({...valid,message}),res);assert.equal(res.statusCode,200);
 }
 assert.match(calls[0].text,/Message:\nNot provided/);
 assert.match(calls[1].text,/Message:\nHi/);
});
test('provider rejection does not produce a successful inquiry',async()=>{
 const handler=createInquiryHandler({env,transport:{sendMail:async()=>{throw new Error('invalid key');}}});
 const res=response();await handler(request(),res);assert.equal(res.statusCode,502);assert.equal(res.body.success,false);assert.ok(!JSON.stringify(res.body).includes('invalid key'));
});
test('origin, method, size, and request rate are enforced',async()=>{
 const handler=createInquiryHandler({env:{}});
 let res=response();await handler(request(valid,{method:'GET'}),res);assert.equal(res.statusCode,405);
 res=response();await handler(request(valid,{headers:{origin:'https://another-site.example','content-type':'application/json'}}),res);assert.equal(res.statusCode,403);
 res=response();await handler(request({...valid,message:'x'.repeat(25000)}),res);assert.equal(res.statusCode,400);
 for(let i=0;i<4;i++){res=response();await handler(request(),res);assert.equal(res.statusCode,503);}
 res=response();await handler(request(),res);assert.equal(res.statusCode,429);
});

test('partial recipient acceptance never reports complete success',async()=>{
 const handler=createInquiryHandler({env,transport:{sendMail:async()=>({messageId:'partial',accepted:['info@panchathanlogistics.com'],rejected:['sales.panchathanlogistics@gmail.com']})}});
 const res=response();await handler(request(),res);assert.equal(res.statusCode,502);assert.equal(res.body.success,false);
});
