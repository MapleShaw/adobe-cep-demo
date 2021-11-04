var express = require('express')
// const Stream = require('stream')
var request = require('request')
var app = express()

app.use('*', function (req, res) {
  req.headers.origin = 'https://1810000001.vs.qcloudecdn.com'
  // req.headers.host = 'api-base.vs.tencent.com'
  // req.headers.referer = 'https://1810000001.vs.qcloudecdn.com/'
  req.headers.cookie = 'tf_session_id_1500003202=617282e47ef7d30001909e02; tf_skey_1500003202=N6RSwCqV/MvtuSGwdyZJb0+MU5tcbcIMbY8Y28T/3BATzo4+dIdz0CBGRBm5dKs7Z0sShPHQ2p7qHwi5wvL7tyh8s1RI77JVBLyiuJDQDusFkr6uYXVk0173py2OfOC5iQv0WAQQCRH2QKkzGthttetyPrqQBJpc3gVS8lZblvY=; tf_token_1500003202=; x_host_key_access_https=a3032e8add007378928e3f1af3ca9b2d494cb93b_s; tf_session_id_1810000001=6180e3bc04f5af0001bf1bba; tf_skey_1810000001=Wx1U5Eqe1AgtbLiEYvT27+GwAKkOdWarfuQwLQvsfRQb4XShQBVz8sfve7lnmH+VQ1+qbOjYD/zmGXghUHx3GUpxD3rPFSbfOfp/DBJdI9WETeCWuSGyMpaXBwIWltzpiCzjuN895cCFN9yQdnex5cE0hvlPZQeiOhpAuc4Va+4=; tf_token_1810000001='
  var url = 'https://api-base.vs.tencent.com/tfusion-yc306' + req.originalUrl

  // const writableStream = new Stream.Writable()

  // writableStream._write = (chunk, encoding, next) => {
  //   console.log(chunk.toString(), '========')
  //   next()
  // }
  req.pipe(request(url)).pipe(res)
})
app.listen(process.env.PORT || 7777)
