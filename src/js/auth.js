import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { init } from './firebase';

//Configuração
const firebaseConfig = init()

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function autentica() {
  const dados = dadosParaAutentica()
  signInWithEmailAndPassword(auth, dados.email, dados.password)
    .then((userCredential) => {
      const user = userCredential.user
      alert('usuário logado')
      setPersistence(auth, browserSessionPersistence)
      window.location.href = './index.html';
    })
    .catch((error) => {
      alert('Senha ou Email incorretos')
    });
}

window.auth = function (pageLink) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    } else {
      alert("Usuário não está logado")
      window.location.href = './autenticacao.html'
    }
  });
  if (pageLink !== '' && pageLink !== null && pageLink !== undefined) {
    window.location.href = pageLink
  }
}

function saindoLogin() {
  signOut(auth).then(() => {
    window.location.href = './autenticacao.html'
  }).catch((error) => {
    console.log('algo deu errado');
  });
}
if (document.getElementById("btnSair") !== '' && document.getElementById("btnSair") !== null && document.getElementById("btnSair") !== undefined)
  document.getElementById("btnSair").onclick = function () {
    saindoLogin();
  };

if (document.getElementById("autentica") !== '' &&
  document.getElementById("autentica") !== null &&
  document.getElementById("autentica") !== undefined) {
  const form = document.getElementById('autentica');
  form.addEventListener('submit', (event) => {
    autentica();
    event.preventDefault();
  });
}


// Retorna os dados do formulário
function dadosParaAutentica() {
  const email = document.getElementById('email').value
  const password = document.getElementById('pass').value
  return { email, password }
}