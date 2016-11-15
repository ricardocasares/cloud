var fb = require('firebase/app')
var db = require('firebase/database')
var ago = require('from-now')
var cfg = require('./config')
var formData = require('get-form-data')
var app = fb.initializeApp(cfg.firebase)

var q = []
var qr = document.querySelector('.qr img')
var container = document.querySelector('.bubbles')

setInterval(process, 5000)
setInterval(attention, 15000)

var posts = app
  .database()
  .ref('posts')

posts.on('child_added', queue)

function queue (snap) {
  var fn = function () { onPost(snap) }
  q.push(fn)
}

function process () {
  if (!q.length) return
  q.shift()()
}

function attention () {
  qr.classList.add('tada')
  setTimeout(function () { qr.classList.remove('tada') }, 1000)
}

function onPost (snap) {
  var node = createNode(snap.val())
  container.insertBefore(node, container.firstChild)
}

function createNode (post) {
  var el = document.createElement('div')
  var msg = document.createElement('p')
  var meta = document.createElement('p')

  msg.setAttribute('class', 'msg')
  meta.setAttribute('class', 'metadata')
  el.setAttribute('class', 'bubble float')

  msg.innerText = post.msg
  meta.innerText = [ago(post.created, cfg.ago), 'by', post.name].join(' ')

  el.appendChild(msg)
  el.appendChild(meta)

  return el
}

function createPost (post) {
  var now = new Date()

  post.name = post.name || 'Anonymous'
  post.created = now.getTime()

  return posts.push(post)
}

function onSubmit () {
  var msg = document.querySelector('#msg')
  var form = document.querySelector('#post')
  var name = document.querySelector('#name')
  var valid = document.querySelector('.post')
  var email = document.querySelector('#email')
  var data = formData(form)

  if (msg.value === '') {
    valid.classList.add('has-error')
    return undefined
  } else {
    valid.classList.remove('has-error')
  }

  msg.value = ''
  name.value = ''
  email.value = ''
  createPost(data)
}

window.onSubmit = onSubmit
