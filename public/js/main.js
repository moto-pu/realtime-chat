'use strict';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {getDatabase, ref, push, onValue, get, child} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQSdaa_5ZveFQWWW5QbW0zlKK1ONuLZbw",
  authDomain: "hack-hour-37caf.firebaseapp.com",
  projectId: "hack-hour-37caf",
  storageBucket: "hack-hour-37caf.appspot.com",
  messagingSenderId: "176324935701",
  appId: "1:176324935701:web:311e0a44716d97d4f00e1c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();
console.log(database);
let room = "chat_room";

window.onload = ()=> {
  const send = document.getElementById("send");
  const name = document.getElementById("name");
  const message = document.getElementById("message");
  const output = document.getElementById("output");
  const statusMessage = document.getElementById('statusMessage');
  const loginBlk = document.querySelector('#loginBlk');
  const loginElm = document.querySelector('#login');
  const logoutElm = document.querySelector('#logout');
  const emailElm = document.querySelector('#email');
  const passwordElm = document.querySelector('#password');


  auth.onAuthStateChanged((user) => {
    if (user) {
      statusMessage.innerText = `ようこそ${user.email}さん`;
      loginBlk.style.display = 'none';
      logoutElm.style.display = 'block';
    } else {
      statusMessage.innerText = 'ログインしていません';
      loginBlk.style.display = 'block';
      logoutElm.style.display = 'none';
    }
  });


//送信処理
  send.addEventListener('click', ()=>{
    const now = new Date();
    push(ref(database, room), {
      name: name.value,
      message: message.value,
      date: now.getFullYear() + '年' + Number(now.getMonth() + 1) + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
    });
    localStorage.setItem('name', name.value);
    message.value = "";
  });

//受信処理

  onValue(ref(database, room), (snapshot) => {
    if (snapshot.exists()) {
      output.innerHTML = '';

      const k = snapshot.key;
      console.log(k);
      console.log(snapshot.val());
      const data = snapshot.val();
      Object.values(data)
          .map((elm, idx) => ({...elm, id: idx + 1}))
          .reverse()
          .forEach(elm => {
            let str = "";
            str += '<div class="name">' + elm.id + '</div>';
            str += '<div class="name">名前：' + elm.name + '</div>';
            str += '<div class="text">日時：' + elm.date + '</div>';
            str += '<div class="text">メッセージ：' + elm.message + '</div><hr>';
            output.innerHTML += str;
          });

    } else {
      console.log('No data');
    }
  });


  loginElm.addEventListener('click', ()=>{
    const email = emailElm.value;
    const password = passwordElm.value;
    localStorage.setItem('email', email);
    console.log({email,password});
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log({user});
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error({errorCode, errorMessage});
        });
  });

  logoutElm.addEventListener('click', ()=>{
    signOut(auth).then(() => {
      console.log('logout!');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error({errorCode, errorMessage});

    });
  });

  };
