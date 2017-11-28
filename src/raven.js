let Raven = require('raven-js')
Raven.config('http://f9f75b5b02694e0ca7af55444d33b618@mgmsentry.knf.local/3').install()

exports.Raven = Raven
