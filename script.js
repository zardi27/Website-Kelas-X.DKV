const akunSiswa = [
    {username:"Ajeng Rahmadani", password:"Ajeng01"},
    {username:"Andi Tendri", password:"Andi02"},
    {username:"Angela Nafisha Azhary", password:"Angela03"},
    {username:"Angelica Kireina Agta", password:"Angelica04"},
    {username:"Anggita Khoiru Nazwa", password:"Anggita05"},
    {username:"Asyifa Arya Cinta", password:"Asyifa06"},
    {username:"Asyifah Nurlailah", password:"Asyifah07"},
    {username:"Bilqis Rahma Savitri", password:"Bilqis08"},
    {username:"Chantika", password:"Chantika09"},
    {username:"Daffa Putra Pratama", password:"Daffa10"},
    {username:"Danu Arta", password:"Danu11"},
    {username:"Dea Naura Nurhayati", password:"Dea12"},
    {username:"Erhilia Juman", password:"Erhilia13"},
    {username:"Esa Fahreza", password:"Esa14"},
    {username:"Exsit Al Mughniy Kansha", password:"Exsit15"},
    {username:"Fazia", password:"Fazia16"},
    {username:"Febriyansyah", password:"Febri17"},
    {username:"Fitriya Ramadhani Pratiwi", password:"Fitri18"},
    {username:"Fyra Cantiqa Aryani", password:"Fyra19"},
    {username:"Khotimah Az-Zahra", password:"Khotimah20"},
    {username:"Lutfiana Fadila", password:"Lutfiana21"},
    {username:"Megita Triyani", password:"Megita22"},
    {username:"Muhammad Alif Usman", password:"Alif23"},
    {username:"Muhammad Fadli Pasha", password:"Fadli24"},
    {username:"Muhammad Khadafi", password:"Khadafi25"},
    {username:"Muhammad Nurrizky Ananda", password:"Nurrizky26"},
    {username:"Nabilah", password:"Nabilah27"},
    {username:"Nada Zaqylbi Aszaq", password:"Nabila28"},
    {username:"Nazwua Safitri", password:"Nazwua29"},
    {username:"Nisya Naila Nida", password:"Nisya30"},
    {username:"Qatrunnada Amalia Suhendar", password:"Qatrun31"},
    {username:"Raehana", password:"Raehana32"},
    {username:"Rika Putri Rabbani", password:"Rika33"},
    {username:"Riki Putra Rabbani", password:"Riki34"},
    {username:"Sabrina Anjani Sunarya", password:"Sabrina35"},
    {username:"Safira Helia Putri", password:"Safira36"},
    {username:"Safira Yosiana", password:"Yosiana37"},
    {username:"Syifa Annisa Mardiyatillah", password:"Syifa38"},
    {username:"Tabita Kazia Aprilia", password:"Tabita39"},
    {username:"Wika Nur Aida", password:"Wika40"},
    {username:"Zhafran Satria Hendrawan", password:"Zhafran41"}
];

function Login() {
    const userEl = document.getElementById("user");
    const passEl = document.getElementById("pass");
    const pesanEl = document.getElementById("pesan");

    if (!userEl || !passEl) return;

    var usernameInput = userEl.value.trim();
    var passwordInput = passEl.value.trim();

    let siswaDitemukan = akunSiswa.find(data => 
        data.username.toLowerCase() === usernameInput.toLowerCase() && data.password === passwordInput
    );

    if (siswaDitemukan) {
        if (pesanEl) {
            pesanEl.style.color = "green";
            pesanEl.textContent = "Login Berhasil! Menuju halaman utama...";
        }
        setTimeout(function() {
            window.location.href = "home.html"; 
        }, 1000);
    } else {
        if (pesanEl) {
            pesanEl.style.color = "red";
            pesanEl.textContent = "Nama atau password salah!";
        }
    }
}

function lihatPassword() {
    var x = document.getElementById("pass");
    if (x) {
        x.type = (x.type === "password") ? "text" : "password";
    }
}

function filterSiswa() {
    var input = document.getElementById('cariSiswa').value.toLowerCase();
    var grid = document.getElementById('daftarSiswa');
    
    if (grid) {
        var items = grid.getElementsByClassName('siswa-item');

        for (var i = 0; i < items.length; i++) {
            var heading = items[i].getElementsByTagName('h3')[0];
            if (heading) {
                var nama = heading.textContent.toLowerCase();
                if (nama.includes(input)) {
                    items[i].style.display = "";
                } else {
                    items[i].style.display = "none";
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
  const user = document.getElementById("user");
  const pass = document.getElementById("pass");
  [user, pass].forEach(function (field) {
    if (field) field.addEventListener("keydown", function (event) {
      if (event.key === "Enter") Login();
    });
  });
});


/* Javascript musik */

document.addEventListener("DOMContentLoaded", function () {
    const musik = document.getElementById("musik");

    if (!musik) return;

    musik.volume = 0.3;

    musik.play().catch(function () {
        console.log("Musik menunggu interaksi pengguna.");
    });
});
