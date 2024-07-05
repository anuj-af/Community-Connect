
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('newMessage', (message,currentUser) => {

        const messagesContainer = document.getElementById('messages');

        const messageElement = document.createElement('div');
        const innerDiv = document.createElement('div');
        const innnerH5=document.createElement('h5');
        const H5div1=document.createElement('div');
        const div1H2=document.createElement('h2');
        const H5div2=document.createElement('div');
        const div2H3=document.createElement('h3');
        const userProfile=document.createElement('img');
        
        
        var currentdate = new Date();
        var datetime =currentdate.getHours() +":"+ currentdate.getMinutes();

        div1H2.innerHTML=`${message.content}`;
        div1H2.classList.add('text-white','text-sm', 'font-normal', 'leading-snug');
        H5div1.classList.add('px-3', 'py-2','bg-indigo-600' ,'rounded');
        H5div1.appendChild(div1H2);

        div2H3.innerHTML=`${datetime}`;
        div2H3.classList.add('text-gray-500', 'text-xs', 'font-normal', 'leading-4', 'py-1');
        H5div2.classList.add('justify-start', 'items-center', 'inline-flex');
        H5div2.appendChild(div2H3);

        innnerH5.innerHTML='You';
        innnerH5.classList.add('text-right', 'text-gray-900', 'text-sm', 'font-semibold', 'leading-snug' ,'pb-1');
        innnerH5.appendChild(H5div1);
        innnerH5.appendChild(H5div2);

        innerDiv.classList.add('grid', 'mb-2');
        innerDiv.appendChild(innnerH5);

        userProfile.src=`${message.sender.image.url}`;
        userProfile.classList.add('w-10', 'h-11');

        messageElement.classList.add('flex', 'gap-2.5' ,'justify-end' ,'pb-5');
        messageElement.appendChild(innerDiv);
        messageElement.appendChild(userProfile);

        messagesContainer.appendChild(messageElement);


        //MessageElement : 

        //<div class="flex gap-2.5 justify-end pb-5">
        //  (innerDiv)
        //  <div class="grid mb-2">
        //      (innerH5)
        //     <h5 class="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">You</h5>
        //         (H5div1)
        //         <div class="px-3 py-2 bg-indigo-600 rounded">
        //              (div1H2)
        //              <h2 class="text-white text-sm font-normal leading-snug"><%= message.content %></h2>
        //         </div>
        //         (H5div2)
        //         <div class="justify-start items-center inline-flex">
        //              (div2H3)
        //             <h3 class="text-gray-500 text-xs font-normal leading-4 py-1">05:14 PM</h3>
        //         </div>
        //  </div>
        //  (userProfile)
        //  <img src="<%= message.sender.image.url %>" alt="Hailey image" class="w-10 h-11">
        //</div>
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
                socket.emit('sendMessage', data,currentUser);
                document.getElementById('messageContent').value = '';
            });
    });
});