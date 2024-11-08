let stompClient = null;
let username = '';
let joined = false;

function connect(callback) {
    const socket = new SockJS('/chat-websocket');
    stompClient = Stomp.over(socket);

    // Connect and set up the callback when connection is successful
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Subscribe to the chat topic to receive messages
        stompClient.subscribe('/topic/messages', function (messageOutput) {
            const message = JSON.parse(messageOutput.body);
            showMessage(message.content, message.sender);
        });

        // Call the callback function after connection is established
        if (callback) {
            callback();
        }
    });
}

function joinChat() {
    username = document.getElementById('username').value;

    if (username.trim() === "") {
        alert("Please enter a valid username!");
        return;
    }

    if (joined) {
        alert("You have already joined the chat.");
        return;
    }

    document.getElementById('usernameInputDiv').style.display = 'none';
    document.getElementById('messageInputDiv').style.display = 'flex';

    // Establish the WebSocket connection and send the "User joined" message after connection
    connect(() => {
        const joinMessage = {
            sender: "System",
            content: `${username} has joined the chat!`
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(joinMessage));
        document.getElementById('userStatus').textContent = `${username} is online`;
        joined = true;
    });
}

function sendMessage() {
    const messageContent = document.getElementById('message').value;

    if (messageContent.trim() !== "") {
        const message = {
            sender: username,
            content: messageContent
        };
        stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
        document.getElementById('message').value = "";  // Clear the input field
    }
}

function exitChat() {
    const exitMessage = {
        sender: "System",
        content: `${username} has left the chat.`
    };
    stompClient.send("/app/sendMessage", {}, JSON.stringify(exitMessage));  // Send exit notification
    stompClient.disconnect();  // Disconnect WebSocket
    document.getElementById('messages').innerHTML = "";
    document.getElementById('messageInputDiv').style.display = 'none';
    document.getElementById('usernameInputDiv').style.display = 'flex';
    document.getElementById('username').value = "";
    document.getElementById('userStatus').textContent = '';
    joined = false;
}

function showMessage(message, sender) {
    const messageList = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    if (sender === username) {
        messageElement.classList.add('sent');  // Highlight sent messages
    }
    
    messageElement.innerHTML = `<strong>${sender}: </strong>${message}`;
    messageList.appendChild(messageElement);
    messageList.scrollTop = messageList.scrollHeight;  // Scroll to bottom of messages
}
