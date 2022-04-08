import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { stubString } from 'lodash';

//Configuração
const firebaseConfig = {
    apiKey: "AIzaSyCrC9v2iBY9p_fScTMJgAmGHsfbDXx-5oc",
    authDomain: "doce-amor-1e212.firebaseapp.com",
    projectId: "doce-amor-1e212",
    storageBucket: "doce-amor-1e212.appspot.com",
    messagingSenderId: "10911075617",
    appId: "1:10911075617:web:d7ffc01fcbc5a0b1c88260"
};

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

window.auth = function(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
        } else {
          alert("Usuário não está logado")
          window.location.href = './autenticacao.html'
        }
      });
}

// Retorna os dados do formulário
function dadosParaAutentica() {
    const email = document.getElementById('email').value
    const password = document.getElementById('pass').value
    return { email, password }
}
