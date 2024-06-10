post "/users" untuk register user
{
    "username": "",
    "password": "",
    "confirmPassword": ""
}

post "/login" untuk login
{
    "username": "",
    "password": ""
}

get "/users" untuk get data user login
headers : 
Authorization : Bearer token


put "/users" untuk ubah password
headers : 
Authorization : Bearer token
{
    "password": "",
    "newPassword": "",
    "confirmNewPassword: ""
}

delete "/logout" untuk logout
headers : 
Authorization : Bearer token

delete "/users" untuk delete account user
headers : 
Authorization : Bearer token

post "/history/:skintype" (oily/dry/normal) untuk menyimpan history sesuai jenis kulit
headers : 
Authorization : Bearer token

get "/history" untuk mendapatkan history user
headers : 
Authorization : Bearer token