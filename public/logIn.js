const socket = io();


const userName = document.getElementById('userName')
const submitSession = document.getElementById('submitSession')
submitSession.addEventListener('submit',(e) => {
    e.preventDefault()
})

const goToSignInBtn = document.querySelector('#goToSignIn');

goToSignInBtn.addEventListener('click',() => {
    window.location.assign('/signIn');
})