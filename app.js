var dns = require("dns")
var request = require("request")
var config = require("./config.js")
const url = 'https://api.digitalocean.com/v2'

if(!config.domains){
  console.log('Missing a list of domains in config.js')
  process.exit()
}
if(!config.token){
  console.log('Missing token in config.js')
}

config.domains.forEach(domain => {
  dns.resolve(domain, function(err,ip){
    request("http://ipv4bot.whatismyipaddress.com/", function(err, res, body){
      if(ip[0] !== body)
        getARecord(domain, A => {
          upsert(A, ip[0], domain, (err, res, body) => {
            console.log(body)
          })
        })
    })
  })
})

function upsert(A, ip, domain, callback){
  var form = {
    type: "A",
    name: "@",
    data: ip
  }
  if(!A){
    req('post',`${url}/domains/${domain}/records`, callback, form)
  } else {
    req('put',`${url}/domains/${domain}/records/${A.id}`, callback, form)
  }
}

function getARecord(domain, callback){
  req('get', `${url}/domains/${domain}/records`, (err, res, body) => {
    callback(body.domain_records.filter(record => {
      return record.type == "A" && record.name == "@"
    })[0])
  })
}

function req(method, url, callback, form){
    var payload = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + config.token
      }
    }
    if(form)
      payload.form = form
    console.log(form)
    request[method](url, payload, (err, res, body) => { callback(err, res, JSON.parse(body))})
}