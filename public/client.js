
// initializing the socket on the client side
let socket = io();

let btnSend = $("#btnSend")
let chatMessageTextBox = $("#chatMessageTextBox")
let chatMessagesList = $("#chatMessagesList")
let chatUserName = $("#chatUserName")
let chatDiv = $("#chat-div")

btnSend.click(function(){

  let message = chatUserName.val() + ': ' + chatMessageTextBox.val()
  chatMessageTextBox.val('')
  // emit means sending to the channel/room
  socket.emit('chat',message)

})

// listening to the channel called chat
// this is the response from the server
socket.on('chat',function(message){
  let chatMessageLI = $("<li>").addClass("list-group-item")
  chatMessageLI.html(message)
  chatMessagesList.append(chatMessageLI)
  chatDiv.scrollTop = chatDiv.scrollHeight
})

// listening to that channel
/*
socket.on('digitalcrafts2018',function(message){

  let chatMessageLI = document.createElement("li")
  chatMessageLI.innerHTML = message
  chatMessagesList.appendChild(chatMessageLI)
}) */

/*
let btnSend = document.getElementById("btnSend")
btnSend.addEventListener('click',function(){
  let chatMessage = chatMessageTextBox.value
  socket.emit('chat message',chatMessage)
})


socket.on('chat message',function(message){

  let li = document.createElement("li")
  li.innerHTML = message
  chatMessages.appendChild(li)

})

// update users count
socket.on('update users count',function(count){
  totalUsersCountHeading.innerHTML = count
}) */
