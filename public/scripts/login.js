document.addEventListener('DOMContentLoaded', ()=> {

    const form = document.getElementById('form');
    const button = form.querySelector('#button');
    const errorHolder = form.querySelector('.error-holder')

    function validForm(){

        let login = form.querySelector('#login').value
        let password = form.querySelector('#password').value
        const body = JSON.stringify({
            login,
            password,
        })
        if (login === ''){
            errorHolder.innerHTML = 'Введите телефон или email'
        }else if (password === ''){
            errorHolder.innerHTML = 'Введите пароль'
        }else{
            errorHolder.innerHTML = ''
            return body
        }
    }
    function sendForm (e) {
        const body = validForm()
        if(body){
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/login' , true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
            xhr.send(body);
            xhr.onload = () => {
                if (xhr.status != 200) {
                    errorHolder.innerHTML = JSON.parse(xhr.response).message
                } else {
                    //Сохраняем токен
                    const refreshToken = JSON.parse(xhr.response).refreshToken
                    localStorage.setItem('refreshToken', refreshToken);
                    document.location.href = '/'
                }
              }
        }
        
    }
    button.addEventListener('click', (e) => sendForm(e))

    document.addEventListener('keypress',  (e) => {
        if (e.key === 'Enter') {
            sendForm(e)
          }
    })
})