import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, getIdToken } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import '../css/style.css'

//Configuração
const firebaseConfig = {
  apiKey: "AIzaSyCrC9v2iBY9p_fScTMJgAmGHsfbDXx-5oc",
  authDomain: "doce-amor-1e212.firebaseapp.com",
  projectId: "doce-amor-1e212",
  storageBucket: "doce-amor-1e212.appspot.com",
  messagingSenderId: "10911075617",
  appId: "1:10911075617:web:d7ffc01fcbc5a0b1c88260"
};
//Inicia o Firebase
const app = initializeApp(firebaseConfig);

// Inicia o database
const database = getDatabase();

//Inicia o Firestore
const db = getFirestore(app);

//Inicia a autenticacao
const auth = getAuth(app);

function writeUserData(idToken, email,) {
  const db = getDatabase();
  set(ref(db, 'users/' + 'user2'), {
    id: idToken,
    email: email,
  });
}

function recebeId() {
  getIdToken(auth.currentUser)
    .then((idToken) => {
      return idToken
    })
    .catch((error) => {
      console.log('token não gerado');
    });
}

window.autentica = function () {
  const dados = dadosParaAutentica()
  signInWithEmailAndPassword(auth, dados.email, dados.password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert('usuário logado')
      setPersistence(auth, browserSessionPersistence)
      window.location.href = 'adicionar-novo.html'
    })
    .catch((error) => {
      alert('Senha ou Email incorretos')
    });
}

//Verifica se existe no Firebase
async function verificaDados(consulta) {
  const produtos = collection(db, "Produtos-docs");
  const q = query(produtos, where("nome", "==", consulta));
  const querySnapshot = await getDocs(q);
  let valuesBolo = {}
  querySnapshot.forEach((doc) => {
    valuesBolo = doc.data()
  });
  return valuesBolo.nome
}

// Retorna os dados do formulário
function dadosParaAutentica() {
  const email = document.getElementById('email').value
  const password = document.getElementById('pass').value
  return { email, password }
}


// Retorna os dados do formulário
function dadosParaServ() {
  let radios = document.getElementsByName("tipo");
  let valueTipo = ''
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      valueTipo = radios[i].value
    }
  }
  let dadosServ = {
    nome: document.getElementById('nome').value,
    tempo: parseInt(document.getElementById('tempo').value),
    tipo: valueTipo
  }
  return dadosServ
}

//Sobe os dados no Firebase
window.adicionarDados = async function () {
  const dados = dadosParaServ()
  const verifica = await verificaDados(dados.nome);
  const idDeSessao = recebeId()
  if (dados.nome == verifica) {
    alert("A receita já Existe")
  }
  else {
    if(idDeSessao == recebeId()){
    setDoc(doc(db, "Produtos-docs", dados.nome), dados);
    alert("Receita adicionada ao catálogo com sucesso com sucesso")
    }
    else{
    alert("Usuário não está logado")
    window.location.href = 'autenticacao.html'
    }
  }
}



/*
const produtos = collection(db, "Produtos-docs");
const q = query(produtos, where("nome", "==", "Bolo de chocolate"));
const querySnapshot = await getDocs(q);
let valuesBolo = {}
querySnapshot.forEach((doc) => {
  valuesBolo = doc.data()
  console.log(valuesBolo.nome);
});

//Recebe dados
async function lerDados(user) {
  const recebeDados = await getDoc(doc(db, "db", user))
  let dados = recebeDados.data()
  console.log(dados.nome)
  return dados;
}

lerDados(Ada);
lerDados(Lara);
lerDados(Bruno);

dadosBruno = lerDados(Bruno);
console.log(dadosBruno.nome);
signInWithEmailAndPassword(auth, dados.email, dados.password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Email ou senha inválidos")
    });
*/