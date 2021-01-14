document.addEventListener('DOMContentLoaded', ()=> {

    const container = document.getElementById('users-list')
    const title = document.querySelector('.title')
    const errorHolder = document.getElementById('error-holder')
    const buttons = document.querySelector('.users-btn')
    let html = ''
    let superUserButtons = ''
    function getData(){
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/users' , true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
            xhr.onload = () => {
                if (xhr.status != 200) {
                    reject(JSON.parse(xhr.response).message)
                } else {
                    const users = JSON.parse(xhr.response).users
                    const isSuperUser = JSON.parse(xhr.response).isSuperUser
                    resolve({
                        users,
                        isSuperUser
                    })
                }
              }
            xhr.send();
        }) 
    }
    async function renderUsers(){
        html = ''
        const response = await getData().catch(error =>{
            console.error(error)
        })
        const users = response.users
        const isSuperUser = response.isSuperUser
        if (Array.isArray(users)){ 
            title.innerHTML = 'Все пользователи'
            users.forEach(element => {
                date = new Date(+element.date)
                let gender = 'Неизвестен'
                if (element.gender === 'm'){
                    gender = 'Мужской'
                }else{
                    gender = 'Женский'
                }
                // Рендер страницы для админа
                if (isSuperUser){
                    if (element.superUser){
                        html+= `
                        <li class="user">
                            <table>
                                <tr>
                                    <td class="first-col"><img src="svg/star.svg" alt="" class="star"></td>
                                    <td class="first-col"></td>
                                    <td>Имя: ${element.name}</td>
                                    <td class="user-login">Логин: ${element.login}</td>
                                    <td>Пол: ${gender}</td>
                                    <td>Дата регистрации: ${date.toLocaleString()}</td>
                                </tr>
                            </table>
                        </li>
                        `
                    }else{
                        html+= `
                        <li class="user">
                            <table>
                                <tr>
                                    <td class="first-col super-user" ><img src="svg/star.svg" alt="" class="star pre-star"></td>
                                    <td class="first-col bin"><a href="#"><img src="svg/delete.svg" alt="" class="star bin"></a></td>
                                    <td>Имя: ${element.name}</td>
                                    <td class="user-login">Логин: ${element.login}</td>
                                    <td>Пол: ${gender}</td>
                                    <td>Дата регистрации: ${date.toLocaleString()}</td>
                                </tr>
                            </table>
                        </li> 
                        `
                    } 
                    buttons.innerHTML = `
                    <button class="add-btn" id="add-btn">+ Добавить</button>
                    <button id="main-btn" type="button" onclick="document.location='/'">На главную</button>
                    `
                // Рендер страницы для обычного пользователя
                }else{
                    if (element.superUser){
                        html+= `
                        <li class="user">
                            <table>
                                <tr>
                                    <td class="first-col"><img src="svg/star.svg" alt="" class="star"></td>   
                                    <td>Имя: ${element.name}</td>
                                    <td class="user-login">Логин: ${element.login}</td>
                                    <td>Пол: ${gender}</td>
                                    <td>Дата регистрации: ${date.toLocaleString()}</td>
                                </tr>
                            </table>
                        </li>
                        `
                    }else{
                        html+= `
                        <li class="user">
                            <table>
                                <tr>
                                    <td class="first-col"></td>
                                    <td>Имя: ${element.name}</td>
                                    <td class="user-login">Логин: ${element.login}</td>
                                    <td>Пол: ${gender}</td>
                                    <td>Дата регистрации: ${date.toLocaleString()}</td>
                                </tr>
                            </table>
                        </li>
                        
                        `
                    } 
                    buttons.innerHTML = `
                    <button id="main-btn" type="button" onclick="document.location='/'">На главную</button>
                    `
                } 
            })
            container.innerHTML = html
            superUserButtons = document.querySelectorAll('.super-user')
            console.log(superUserButtons);
            superUserButtons.forEach(element => {
                element.addEventListener('click', e=> setSuper(e))
            })
        }else{
            title.innerHTML = `<h2>Упс..что-то пошло не так</h2>`
        }
    }
    renderUsers()
    .then(()=> {
        const bins = container.querySelectorAll('#bin')
        bins.forEach(element => {
            element.addEventListener('click', e => {
                e.preventDefault()
                deleteUser(e)
            })
        });
    })
    function deleteUser(event){
        const user = event.target.closest('.user')
        let login = user.querySelector('.user-login').innerHTML
        login = login.replace(/Логин: /i, '')
        body = JSON.stringify({ login })
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/deleteuser' , true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.send(body);
        xhr.onload = () => {
            if (xhr.status != 200) {
                console.error(JSON.parse(xhr.response));
            } else {
                errorHolder.innerHTML = JSON.parse(xhr.response).message
                user.remove()
            }
          }
    }
    let saveButton = ''
    let form = ''
    const addButton = document.getElementById('add-btn')

    function renderUserForm(event){
        addButton.disabled = true
        container.innerHTML += `
        <li class="user">
            <form method="POST" class="users-form" id="form">
                <input type="text" name="name" id="name" placeholder="Имя пользователя">
                <input type="text" name="login" id="login" placeholder="Телефон или email">
                <input type="text" name="password" id="password" placeholder="Пароль">
                <div class="checkboxes user-checkboxes">
                    <input type="radio" name="gender" id="female-check" value="female">
                    <label for="female-check">Женский</label>
                    <input type="radio" name="gender" id="men-check" value="male">
                    <label for="men-check">Мужской</label>
                </div>
                <a href="#" class="save-btn" id="save-btn"><img src="svg/save.svg" alt=""></a>
                <a href="#" class="save-btn cancel-btn" id="cancel-btn"><img src="svg/cancel.svg" alt=""></a>
            </form>
        </li>
        `
       saveButton = document.getElementById('save-btn')
       saveButton.addEventListener('click', e => {
            e.preventDefault()
            createUser(e)
        })
        form = document.getElementById('form');

        const cancelButton = document.getElementById('cancel-btn')
        cancelButton.addEventListener('click', e => {
            e.preventDefault()
            userElem = e.target.closest('.user')
            userElem.remove()
            addButton.disabled = false
        })

    }
    addButton.addEventListener('click', e => renderUserForm(e))

    function createUser (event){
        const menCheckBox = form.querySelector('#men-check')
        const femaleCheckBox = form.querySelector('#female-check')
        let name = form.querySelector('#name').value
        let login = form.querySelector('#login').value
        let password = form.querySelector('#password').value
        let gender = menCheckBox.checked ? 'm' : 'f'
        body = JSON.stringify({
            name,
            login,
            password,
            gender
        })
        console.log(body)
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/reg' , true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.send(body);
        xhr.onload = () => {
            if (xhr.status != 200) {
                errorHolder.innerHTML = JSON.parse(xhr.response).message || 'Что-то пошло не так. Попробуйте еще раз'
            } else {
                errorHolder.innerHTML = JSON.parse(xhr.response).message
                renderUsers()
            }
          }
        const userElem = event.target.closest('.user')
        userElem.remove()
        addButton.disabled = false
    }

    function setSuper(event) {
        const user = event.target.closest('.user')
        const star = user.querySelector('.pre-star')
        let login = user.querySelector('.user-login').innerHTML
        login = login.replace(/Логин: /i, '')
        body = JSON.stringify({ login })
        let xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/setsuper' , true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.send(body);
        xhr.onload = () => {
            if (xhr.status != 200) {
                console.error(JSON.parse(xhr.response));
            } else {
                errorHolder.innerHTML = JSON.parse(xhr.response).message
                star.classList.remove('pre-star')
                renderUsers()
            }
          }
    }
    
})