# maizer-project

[https://maizer.herokuapp.com/](https://maizer.herokuapp.com/)

## Application functionality
+ registration and authorization with JsonWebToken
+ Access to the list of users only for authorized users
+ SuperUser - can delete and create new users, and also issue the "SuperUser" status

## Quickstart


### 1. Install

```shell
npm install
```

### 2. Create config
>Create directory named `config` and file named `keys.js`

## Example `keys.js`
```javascript
module.exports = {
    mongoURI: 'mongodb+srv://<user>:<password>@cluster0.1xcny.mongodb.net/users',
    jwt: '<Secret key for jwt>',
    cookie: '<Secret key for cookie-parser>'
}
```

### 3. Start server

```shell
npm start
```
