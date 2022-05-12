import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc,  addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import '../css/style.css';

function init() {
  return {
    apiKey: "AIzaSyCrC9v2iBY9p_fScTMJgAmGHsfbDXx-5oc",
    authDomain: "doce-amor-1e212.firebaseapp.com",
    projectId: "doce-amor-1e212",
    storageBucket: "doce-amor-1e212.appspot.com",
    messagingSenderId: "10911075617",
    appId: "1:10911075617:web:d7ffc01fcbc5a0b1c88260"
  };
}

//Configuração
const firebaseConfig = init();

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

async function recebeBanco() {
  const database_denfer = {};
  const produtos = collection(db, "Produtos-docs");
  const pesquisa = query(produtos, where("nome", "!=", ""));
  const querySnapshot = await getDocs(pesquisa);
  querySnapshot.forEach((doc) => {
    database_denfer[doc.id] = doc.data()
  });
  window.database = database_denfer;
}
window.deferRecebeBanco = async function () {
  recebeBanco();
  console.log('Amigo estou aqui');
}


async function consultaBancoCompleto() {
  let consulta = dadosParaServ();
  if(window.database == undefined){
    await deferRecebeBanco();
  }
  let database = window.database;
  const q1 = [];
  for (const key1 in database) {
    if (database[key1].nome == consulta.nome || database[key1].tempo == consulta.tempo || database[key1].tipo == consulta.tipo) {
      q1.push(database[key1]);
    }
  }
  console.log(q1);
  const ValueQ1 = q1;
  return { ValueQ1 };
}

//Faz busca no bd
async function consultaBanco(q) {
  const querySnapshot = await getDocs(q);
  let values = [];
  querySnapshot.forEach((doc) => {
    values.push(doc.data());
  });
  return values;
} 

//Verifica se existe no Firebase
async function verificaDados(consulta) {
  const produtos = collection(db, "Produtos-docs");
  const q = query(produtos, where("nome", "==", consulta));
  let valuesBolo = await consultaBanco(q);
  return valuesBolo.nome;
}

//Retorna os dados do formulário
function dadosParaServ() {
  let radios = document.getElementsByName("tipo");
  let valueTipo = '';
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      valueTipo = radios[i].value
    }
  }
  let dadosServ = {
    nome: document.getElementById('nome').value,
    tempo: parseInt(document.getElementById('tempo').value),
    tags: document.getElementById('tags').value.split(" "),
    tipo: valueTipo
  }
  return dadosServ;
}

//Consulta tudo no bd e exibe
window.buscarDados = async function () {
  const { ValueQ1 } = await consultaBancoCompleto();
  imprimeResultado(ValueQ1);
}

//Lança na tela
function imprimeResultado(ValueQ1) {
  let elementin = document.getElementById(`resultado`);
  elementin.innerHTML = '';
  console.log(ValueQ1);
  for (const key in ValueQ1) {
    if (Object.keys(ValueQ1[key]).length !== 0) {
      exibeResultado(ValueQ1[key]);
      for (const key2 in ValueQ1[key]) {
        exibeResultado(ValueQ1[key][key2]);
      }
    }
    if (document.getElementById("btnSubmit2") !== null) {
      var Btn2 = document.getElementById("btnSubmit2");
      Btn2.classList.remove("beforeCheck");
      Btn2.classList.add("afterCheck");
    }
  }
}

//função auxiliar
function exibeResultado(consulta) {
  let tags = consulta.tags
  let html =
    `<ul class="resultadosRadio">
      <li id="ratioIN"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></li>
      <li id="ratioNome">Nome: ${consulta.nome}</li>
      <li id="ratioTags">Tags: ${tags}</li>
      <li id="tipoTags">Tipo: ${consulta.tipo}</li>
      <li id="tempoTags">Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
    </ul>`;
  if (consulta.nome !== undefined) {
    let elementin = document.getElementById(`resultado`);
    elementin.insertAdjacentHTML("afterbegin", html);
  }
}

//adm/deletar.html
const auth = getAuth();

//Deleta a receita
async function excluirReceita() {
  let login = 0
  let valueEscolhido = '';
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      login = 1
    }
    else {
      login = 0
      alert("Usuário não está logado")
      window.location.href = './autenticacao.html';
    }
  });
  let radios = document.getElementsByName("escolha");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      valueEscolhido = radios[i].value
    }
  }
  if (login = 1) {
    let database = window.database;
    let deletePath = '';
    for (const key1 in database) {
      if (database[key1].nome == valueEscolhido) {
        deletaDoc = key1;
      }
    }
    await deleteDoc(doc(db, 'Produtos-docs', deletePath));
    alert("A Receita foi Excluída");
    window.location.href = './index.html';
  }
}
window.excluirReceitaDenfer = async function () {
  excluirReceita();
}

//adm/adicionar-novo.html
//Sobe os dados no Firebase
async function adicionarDados() {
  const dados = dadosParaServ();
  let login = 0
  const verifica = await verificaDados(dados.nome);
  if (dados.nome == verifica) {
    alert("A receita já Existe");
  }
  else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        login = 1
      } else {
        alert("Usuário não está logado")
        login = 0
        window.location.href = './autenticacao.html';
      }
    });
    if (login = 1) {
      const sobe = await addDoc(collection(db, "Produtos-docs"), dados);
      alert("Receita adicionada ao catálogo com sucesso com sucesso");
      window.location.href = './index.html';
    }
  }
}
window.adicionarDadosDenfer = async function () {
  adicionarDados();
}

export { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado}