let messages = [];

const setup = () => {
    let sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', sendMessage);
}



const sendMessage = () => {
    let userDropdown = document.getElementById('message-sender');
    let input =  document.getElementById('message-input');
    let timestamp = new Date().toLocaleDateString();

    let messageinf={
        timestamp: timestamp,
        input : input.value,
        user : userDropdown.value
    }

    localStorage.setItem('message', JSON.stringify(messageinf));
    messages.push(messageinf);

    addMessage(input.value, userDropdown.value, timestamp);
}


const addMessage = (input, userDropdown, timestampValue) =>{

    let chatbox = document.getElementById('chat-box');


    let message = document.createElement('div');
    message.id = 'message';
    message.classList.add('message');
    message.classList.add('same-user');
    message.textContent = input;

    timestamp = document.createElement('span');
    timestamp.classList.add('timestamp');
    timestamp.textContent = timestampValue;

    let sender = document.createElement('span');
    sender.classList.add('sender');
    sender.textContent = userDropdown;


    message.appendChild(sender);
    message.appendChild(timestamp);
    chatbox.prepend(message);
}

window.addEventListener('load', setup);