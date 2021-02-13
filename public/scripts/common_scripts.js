function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  
function refreshToken(){
    let expin = getCookie("expin")
        return new Promise((resolve, reject)=>{
            if (Date.now()>expin){
                let refreshToken = localStorage.getItem('refreshToken')
                const body = JSON.stringify({
                    refreshToken
                })
                let xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/auth/refresh-token' , true)
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
                    xhr.send(body);
                    xhr.onload = () => {
                        if (xhr.status != 200) {
                            console.error(JSON.parse(xhr.response).message)
                            reject(JSON.parse(xhr.response).message)
                        } else {
                            //Сохраняем токен
                            const refreshToken = JSON.parse(xhr.response).refreshToken
                            localStorage.setItem('refreshToken', refreshToken)
                            resolve()
                        }
                    }
            }else{
                resolve()
            }
        })
        
}

export {refreshToken};