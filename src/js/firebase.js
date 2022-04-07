import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { stubString } from 'lodash';

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

//Inicia o Firestore
const db = getFirestore(app);

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
const auth = getAuth();

window.adicionarDados = async function () {
  const dados = dadosParaServ()
  const verifica = await verificaDados(dados.nome);
  if (dados.nome == verifica) {
    alert("A receita já Existe")
  }
  else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setDoc(doc(db, "Produtos-docs", dados.nome), dados);
        alert("Receita adicionada ao catálogo com sucesso com sucesso")
        window.location.href = 'index.html'
      } else {
        alert("Usuário não está logado")
        window.location.href = 'autenticacao.html'
      }
    });
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