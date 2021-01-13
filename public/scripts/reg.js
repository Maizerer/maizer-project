document.addEventListener('DOMContentLoaded', ()=>{

    const form = document.getElementById('form')
    const button = form.querySelector('#button')
    const errorHolder = form.querySelector('.error-holder')
    const menCheckBox = form.querySelector('#men-check')
    const femaleCheckBox = form.querySelector('#female-check')
    function validForm(){
        let filterUsername = /^([a-zA-ZА-Яа-я0-9_\-])+$/
        let filterEmail = /^([a-zA-Z0-9_@.\-])+$/
        let filterPhone = /^([0-9])+$/
        let filterPassword = /^[a-zA-ZА-Яа-я0-9!%&@#$\^*?_~+]+$/
        
        let name = form.querySelector('#name').value
        let login = form.querySelector('#login').value
        let password = form.querySelector('#password').value
        let repassword = form.querySelector('#repassword').value
        let gender = menCheckBox.checked ? 'm' : 'f'
        console.log(gender)
        body = JSON.stringify({
            name,
            login,
            password,
            gender
        })
        if (name === ''){
            errorHolder.innerHTML = 'Введите имя'
        }else if (login === ''){
            errorHolder.innerHTML = 'Введите телефон или email'
        }else if (password === ''){
            errorHolder.innerHTML = 'Введите пароль'
        }else if (repassword === ''){
            errorHolder.innerHTML = 'Подтвердите пароль'
        }else if (!femaleCheckBox.checked && !menCheckBox.checked){
            errorHolder.innerHTML = 'Выберите пол'
        }else if (name.length<4){
            errorHolder.innerHTML = 'Имя должно содержать не менее 4 символов'
        }else if (password.length<8){
            errorHolder.innerHTML = 'Пароль должен содержать не менее 8 символов'
        }else if(!filterUsername.test(name)){
            errorHolder.innerHTML = 'Недопустимые символы в имени'
        }else if(password!= repassword){
            errorHolder.innerHTML = 'Пароли не совпадают'
        }else if(login.includes('@')){
            if (!filterEmail.test(login)){
                errorHolder.innerHTML = 'Недопустимые символы в email'
            }else if (!login.includes('.') || login.length<6){
                errorHolder.innerHTML = 'Введите настоящий email'
            }else{
                errorHolder.innerHTML = ''
                return body
            }
        }else if(!filterPhone.test(login)){
            errorHolder.innerHTML = 'Недопустимые символы в номере телефона'
        }else if (password.length<11){
            errorHolder.innerHTML = 'Номер телефона введен некорректно'
        }else{
            errorHolder.innerHTML = ''
            return body
        }
    }
    function sendForm (e) {
        if(validForm()){
            let xhr = new XMLHttpRequest();
            body = validForm()
            xhr.open('POST', '/api/reg' , true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
            xhr.send(body);
            xhr.onload = () => {
                if (xhr.status != 200) {
                    errorHolder.innerHTML = JSON.parse(xhr.response).message
                } else {
                    document.location.href = '/login'
                }
              }
        }
        
    }
    button.addEventListener('click', (e) => sendForm(e))

    document.addEventListener('keypress',  (e) => {
        if (e.key === 'Enter') {
            validForm(e)
          }
    })
    

})

