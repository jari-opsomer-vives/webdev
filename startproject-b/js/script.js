let messages = [];
let chatbox, input, sendButton;

const setup = () => {

    chatbox = document.getElementById("chat-container");
    input = chatbox.getElementById("message-input");
    sendButton = chatbox.getElementById("send-button");

    chatbox = messages;

}

const sendMessage = () => {

    let message = document.createElement("div");
    message.id = "message";
    message.classList.add('message');

    let timestamp = document.createElement("span")
    timestamp.classList.add('timestamp');

    let sender = document.createElement("span");
    sender.classList.add('sender');

    const text = input.value.trim();

    message.appendChild(sender);
    message.appendChild(timestamp);
    chatbox.appendChild(message);

    messages.push(

    );
}

sendButton.addEventListener("click", sendMessage);

window.addEventListener("load", setup);