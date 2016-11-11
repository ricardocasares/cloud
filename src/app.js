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

posts.on('child_added', onPost)

function onPost (snt) {
  container.insertBefore(createNode(snt.val()), container.firstChild)
}

function createNode (post) {
  var el = document.createElement('div')
  var msg = document.createElement('p')
  var meta = document.createElement('p')
  el.setAttribute('class', 'bubble')
  meta.setAttribute('class', 'metadata')
  msg.innerText = post.msg
  meta.innerText = `${ago(post.created, cfg.ago)} by ${post.name}`
  el.appendChild(msg)
  el.appendChild(meta)

  return el
}

function createPost (post) {
  var now = new Date()
  posts.push({
    msg: post.msg,
    name: post.name || 'Anonymous',
    created: now.getTime()
  })
}

function onSubmit () {
  var form = document.querySelector('#post')
  var data = formData(form)
  createPost(data)
}

window.onSubmit = onSubmit