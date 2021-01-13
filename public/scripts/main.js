document.addEventListener('DOMContentLoaded', ()=> {

    const content = document.getElementById('note')
    const buttons = document.getElementById('buttons')
    function getData(){
        return new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/auth' , true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
            xhr.onload = () => {
                if (xhr.status != 200) {
                    reject(JSON.parse(xhr.response).auth)
                } else {
                    resolve(JSON.parse(xhr.response).auth)
                }
              }
            xhr.send();
        }) 
    }
    async function renderContent(){
        let isAuth = await getData().catch(error =>{
            console.error(error)
        })
        if (isAuth){
            content.innerHTML = 'Вы авторизованы на Maizer и можете получить доступ к списку наших пользователей. Попробуйте найти себя :)'
            buttons.innerHTML = `
            <div class="main-btn users-btn">
                <button id="button" type="button" onclick="document.location='/users'">Пользователи</button>
            </div>
            <div class="main-btn">
                <button id="button" type="button" onclick="document.location='/api/logout'">Выход</button>
            </div>
            `
        }else{
            content.innerHTML = 'Вы не авторизованы. Войдите или зарегистрируетесь, чтобы получить доступ к списку пользователей'
            buttons.innerHTML = `
            <div class="main-btn">
                <button id="button" type="button" onclick="document.location='/login'">Вход</button>
            </div>
            <div class="main-btn">
                <button id="button" type="button" onclick="document.location='/reg'">Регистрация</button>
            </div>
            `
        }
    }
    renderContent()
})