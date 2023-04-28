# Devcode Node JS test

## Tools yang di perlukan

-   Git
-   Docker

## Packages yang digunakan

-   express.js
-   morgan
-   mysql2
-   nodemon

## Docker

Program dengan docker dapat dijalankan dengan perintah `docker-compose up -d`, jika ada kode yang ingin diubah dapat dilakukan build ulang dengan perintah : `docker-compose up -d --build --force-recreate`

## Menjalankan projek

-   copy `.env.example` ke `.env` dan sesuaikan config untuk server dan database.
-   install package dengan perintah `npm install`.
-   jalankan projek dengan perintah `npm start` atau `npm run dev` untuk mode development.
