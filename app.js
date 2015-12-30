var dns = require("dns")
var request = require("request")
var env = require("./env")

dns.resolve(env.domainName, function(err,ip){
  request("http://ipv4bot.whatismyipaddress.com/", function(err, res, body){
    ip[0] !== body ? updateIp(body) : process.exit();
  })
})

var apiUrl = "https://api.digitalocean.com/v2/domains/" + env.domainName + "/records/" + env.recordId
function updateIp(ip){
  request.put(apiUrl, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + env.token
    },
    form: {
      type: "A",
      name: "@",
      data: ip
    }
  },function(err, res, body){
    console.log(body)
  })
}