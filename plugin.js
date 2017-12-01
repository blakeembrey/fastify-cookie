'use strict'

const fp = require('fastify-plugin')
const cookie = require('cookie')

function fastifyCookieSetCookie (name, value, options) {
  const opts = options || {}
  if (opts.expires && Number.isInteger(opts.expires)) {
    opts.expires = new Date(opts.expires)
  }
  const serialized = cookie.serialize(name, value, opts)
  this.header('Set-Cookie', serialized)
  return this
}

function fastifyCookiePreHandler (fastifyReq, fastifyRes, done) {
  const cookieHeader = fastifyReq.req.headers.cookie
  fastifyReq.cookies = (cookieHeader) ? cookie.parse(cookieHeader) : {}
  done()
}

function plugin (fastify, options, next) {
  fastify.decorateRequest('cookies', {})
  fastify.decorateReply('setCookie', fastifyCookieSetCookie)
  fastify.addHook('preHandler', fastifyCookiePreHandler)
  next()
}

module.exports = fp(plugin, '>=0.34.0')
