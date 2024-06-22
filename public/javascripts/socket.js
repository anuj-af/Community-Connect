const socket = new io();
    function acceptRequest(userId,communityId){
        const dv=document.getElementById(`btn-${userId}`);
        dv.style.display='none';
        socket.emit("acceptRequest",userId,communityId);

    }

    function sendRequest(userId,communityId){
        socket.emit("sendRequest",userId,communityId);
    }

    function upvote(postId,userId){
        const upBtn=document.getElementById(`upbtn-${postId}`);
        upBtn.classList.toggle('active');
        socket.emit('upvote',postId,userId);
    }
    socket.on('upvoteCount',(upvoteCount,postId)=>{
        const upcount=document.getElementById(`upcount-${postId}`);
        upcount.innerText=upvoteCount;
    })

    function downvote(postId,userId){
        const dwnbtn=document.getElementById(`dwnbtn-${postId}`);
        dwnbtn.classList.toggle('active');
        socket.emit('downvote',postId,userId);
    }
    socket.on('downvoteCount',(downvoteCount,postId)=>{

        const dwncount=document.getElementById(`downcount-${postId}`);
        dwncount.innerText=downvoteCount;
    })
