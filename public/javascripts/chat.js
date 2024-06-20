document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('newMessage', (message) => {
        const messagesContainer = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${message.sender.username}:</strong> ${message.content}`;
        messagesContainer.appendChild(messageElement);
    });

    const sendMessageForm = document.getElementById('sendMessageForm');
    sendMessageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = document.getElementById('messageContent').value;
        // const communityId = '<%= community._id %>'; -> Coming from EJS now

        fetch(`/community/${communityId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                console.log(data.content);
                socket.emit('sendMessage', data);
                document.getElementById('messageContent').value = '';
            });
    });
});