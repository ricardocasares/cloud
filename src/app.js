var fb = require('firebase/app')
var db = require('firebase/database')
var ago = require('from-now')
var app = fb.initializeApp({
  apiKey: 'AIzaSyDt7QEPed9zKn-dzuVXWWihn88ZRS3vXS0',
  authDomain: 'cloud-96b9f.firebaseapp.com',
  databaseURL: 'https://cloud-96b9f.firebaseio.com',
  storageBucket: 'cloud-96b9f.appspot.com',
  messagingSenderId: '914472583546'
})

var container = document.querySelector('.container')

var posts = app
  .database()
  .ref('posts')

posts.on('child_added', onPost)

function onPost (snt) {
  container.insertBefore(createPost(snt.val()), container.firstChild)
}

function createPost (post) {
  var el = document.createElement('div')
  var msg = document.createElement('p')
  var meta = document.createElement('p')
  console.log(post)
  el.setAttribute('class', 'bubble')
  meta.setAttribute('class', 'metadata')
  msg.innerText = post.msg
  meta.innerText = `${ago(post.created)} by ${post.name}`
  el.appendChild(msg)
  el.appendChild(meta)

  return el
}

function postMessage (name, msg) {
  var now = new Date()
  posts.push({
    msg: msg,
    name: name || 'Anonymous',
    created: now.getTime()
  })
}

window.post = postMessage
