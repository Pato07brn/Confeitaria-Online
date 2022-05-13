import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { init } from './firebase';

//Configuração
const firebaseConfig = init()

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.autentica = function () {
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
  if(pageLink !== '' && pageLink !== null && pageLink !== undefined){
    window.location.href = pageLink
  }
}

// Retorna os dados do formulário
function dadosParaAutentica() {
  const email = document.getElementById('email').value
  const password = document.getElementById('pass').value
  return { email, password }
}