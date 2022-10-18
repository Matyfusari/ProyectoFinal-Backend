const socket = io();

socket.on('user',(user) => {
    document.getElementsByTagName('h1')[0].innerHTML = `Hasta luego ${user}`
})


setTimeout(() => {
    window.location.assign('/');
},2000);