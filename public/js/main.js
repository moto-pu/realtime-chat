'use strict';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {getDatabase, ref, push, onValue, get, child} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js";

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
const database = getDatabase();
console.log(database);
let room = "chat_room";
const send = document.getElementById("send");
const name = document.getElementById("name");
const message = document.getElementById("message");
const output = document.getElementById("output");

//送信処理
send.addEventListener('click', function() {
  const now = new Date();
  push(ref(database,room),{
    name: name.value,
    message: message.value,
    date: now.getFullYear() + '年' + Number(now.getMonth()+1) + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
  });
  localStorage.setItem('name', name.value);
  message.value="";
});

//受信処理

onValue(ref(database,room), (snapshot)=> {
  if (snapshot.exists()) {
    output.innerHTML = '';

    const k = snapshot.key;
    console.log(k);
    console.log(snapshot.val());
    const data = snapshot.val();
    Object.values(data)
        .map((elm,idx)=>({...elm, id: idx + 1}))
        .reverse()
        .forEach(elm=> {
      let str = "";
      str += '<div class="name">'+ elm.id + '</div>';
      str += '<div class="name">名前：' + elm.name + '</div>';
      str += '<div class="text">日時：' + elm.date + '</div>';
      str += '<div class="text">メッセージ：' + elm.message + '</div><hr>';
      output.innerHTML += str;
    });

  } else {
    console.log('No data');
  }
});