const socket = io();


const submitSession = document.getElementById('submitSession')
submitSession.addEventListener('submit',(e) => {
    e.preventDefault()
})

const goToLogInBtn = document.querySelector('#goToLogIn');

goToLogInBtn.addEventListener('click',() => {
    window.location.assign('/');
})