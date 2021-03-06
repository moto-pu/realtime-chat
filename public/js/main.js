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

  const nameElm = document.querySelector('#name');
  const nameVal = localStorage.getItem('name') ?? '';
  nameElm.value = nameVal;
  const emailVal = localStorage.getItem('email') ?? '';
  emailElm.value = emailVal;


  auth.onAuthStateChanged((user) => {
    if (user) {
      statusMessage.innerText = `ようこそ${user.email}さん`;
      loginBlk.style.display = 'none';
      logoutElm.style.display = 'block';
      localStorage.setItem('email', user.email);
      localStorage.setItem('isLogin', 'true');
    } else {
      statusMessage.innerText = 'ログインしていません';
      loginBlk.style.display = 'block';
      logoutElm.style.display = 'none';
      localStorage.setItem('isLogin', 'false');
    }
  });

  const isLogin = ()=>localStorage.getItem('isLogin')==='true';
  const getCurrentEmail = ()=>localStorage.getItem('email');

//送信処理
  send.addEventListener('click', ()=>{
    if (!isLogin()) {
      alert('ログインしてからお使いください');
      return;
    }
    if (!name.value || name.value.length === 0) {
      alert('名前を入力してください');
      return;
    }
    if (!message.value || message.value.length === 0) {
      alert('メッセージを入力してください');
      return;
    }
    const now = new Date();
    push(ref(database, room), {
      email: getCurrentEmail(),
      name: name.value,
      message: message.value,
      date: now.getFullYear() + '年' + Number(now.getMonth() + 1) + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
    }).then(data=>{
      console.log(data);
      message.value = "";
    }).catch(err=>{
      if (err.message.indexOf('PERMISSION_DENIED')===0) {
        alert('ログインしてください');
      } else {
        alert(`エラーが発生しました(${err.message})`);
      }
    });
    localStorage.setItem('name', name.value);
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
            str += '<div class="email">メール：' + (elm?.email??'名無し') + '</div>';
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
          location.reload();
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
      location.reload();
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error({errorCode, errorMessage});

    });
  });

  };
