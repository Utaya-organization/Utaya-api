# Utaya
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

post "/predict" untuk prediksi kulit dan menyimpan data hasil prediksi
headers : 
Authorization : Bearer token
{
    image : (type file)
}

get "/history" untuk mendapatkan history user
headers : 
Authorization : Bearer token

get "/skintypes" untuk mendapatkan produk dengan pengelompokan jenis kulit
headers : 
Authorization : Bearer token

route admin
post "/skintype" menambahkan jenis kulit serta produk
headers : 
Authorization : Bearer token
{
    "skinType": "",
    "productName": "",
    "file": (file gambar),
    "urlArticle": "",
    "urlProduct": ""
}

post "/product" menambahkan produk di skintype tertentu
headers : 
Authorization : Bearer token
{
    "skinType": "",
    "productName": "",
    "file": (file gambar),
    "urlArticle": "",
    "urlProduct": ""
}

delete "/product/:skinTypeName/:idProduct"
headers : 
Authorization : Bearer token
