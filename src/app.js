var q = []
var fb = require('firebase/app')
var db = require('firebase/database')
var ago = require('from-now')
var cfg = require('./config')
var formData = require('get-form-data')
var app = fb.initializeApp({
  apiKey: 'AIzaSyDt7QEPed9zKn-dzuVXWWihn88ZRS3vXS0',
  authDomain: 'cloud-96b9f.firebaseapp.com',
  databaseURL: 'https://cloud-96b9f.firebaseio.com',
  storageBucket: 'cloud-96b9f.appspot.com',
  messagingSenderId: '914472583546'
})

var container = document.querySelector('.bubbles')

var posts = app
  .database()
  .ref('posts')

posts.on('child_added', queue)

function queue (snap) {
  var fn = () => onPost(snap)
  q.push(fn)
}

function process () {
  if (!q.length) return
  q.shift()()
}

setInterval(process, 5000)

function onPost (snap) {
  var node = createNode(snap.val())
  container.insertBefore(node, container.firstChild)
}

function createNode (post) {
  var el = document.createElement('div')
  var msg = document.createElement('p')
  var meta = document.createElement('p')

  el.setAttribute('class', 'bubble')
  msg.setAttribute('class', 'msg')
  meta.setAttribute('class', 'metadata')

  msg.innerText = post.msg
  meta.innerText = [ago(post.created, cfg.ago), 'by', post.name].join(' ')

  el.appendChild(msg)
  el.appendChild(meta)

  return el
}

function createPost (post) {
  var now = new Date()

  return posts.push({
    msg: post.msg,
    name: post.name || 'Anonymous',
    created: now.getTime()
  })
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
