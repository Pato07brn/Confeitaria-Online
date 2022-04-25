import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
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

async function consultaBancoCompleto() {
  const consulta = dadosParaServ();
  const produtos = collection(db, "Produtos-docs");

  const q1 = query(produtos,
    where("nome", "==", consulta.nome),
    where("tempo", "==", consulta.tempo),
    where("tipo", "==", consulta.tipo)
  );
  const q2 = query(produtos, where("nome", "==", consulta.nome));
  const q3 = query(produtos, where("tempo", "==", consulta.tempo));
  const q4 = query(produtos, where("tipo", "==", consulta.tipo));

  const ValueQ1 = await consultaBanco(q1);
  const Values = {
    q2: await consultaBanco(q2),
    q3: await consultaBanco(q3),
    q4: await consultaBanco(q4),
  };
  return { ValueQ1, Values };
}

//Faz busca no bd
async function consultaBanco(q) {
  const querySnapshot = await getDocs(q);
  let values = {};
  querySnapshot.forEach((doc) => {
    values = doc.data();
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
    tipo: valueTipo
  }
  return dadosServ;
}

//
//Consulta tudo no bd e exibe
window.buscarDados = async function () {
  const { ValueQ1, Values } = await consultaBancoCompleto();
  imprimeResultado(ValueQ1, Values);
}


function imprimeResultado(ValueQ1, Values) {
  if (ValueQ1.nome == undefined || ValueQ1.nome == null || ValueQ1.nome == '') {
    let html = `<span id="semResultados" >
    Seguem resultados mais próximos
    </span>`;
    let elementin = document.getElementById(`resultado`);
    elementin.insertAdjacentHTML("afterbegin", html);
  }
  if (Values.q2.nome == ValueQ1.nome && Values.q3.nome == ValueQ1.nome && Values.q4.nome == ValueQ1.nome && Object.keys(ValueQ1).length !== 0) {
    exibeResultado(ValueQ1);
    if (document.getElementById("btnSubmit2") !== null) {
      var Btn2 = document.getElementById("btnSubmit2");
      Btn2.classList.remove("beforeCheck");
      Btn2.classList.add("afterCheck");
    }
  }
  for (const key in Values) {
    if (Values[key].nome !== ValueQ1.nome && Values[key].nome !== '' && Values[key].nome !== null && Object.keys(Values[key]).length !== 0) {
      exibeResultado(Values[key]);
      if (document.getElementById("btnSubmit2") !== null) {
        var Btn2 = document.getElementById("btnSubmit2");
        Btn2.classList.remove("beforeCheck");
        Btn2.classList.add("afterCheck");
      }
    }
  }
}

function exibeResultado(consulta) {
  let count = 0;
  console.log(consulta);
  let html =
    `<ul class="resultadosRadio">
      <li id="ratioIN"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></li>
      <li id="ratioNome">Nome: ${consulta.nome}</li>
      <li>Tipo: ${consulta.tipo}</li>
      <li>Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
    </ul>`;
  let elementin = document.getElementById(`resultado`);
  elementin.insertAdjacentHTML("beforeend", html);
  if (document.getElementById("btnSubmit3") !== null) {
    var Btn3 = document.getElementById("btnSubmit3");
    Btn3.classList.remove("beforeCheck");
    Btn3.classList.add("afterCheck");
  }
}

const auth = getAuth();

//adm/deletar.html
//Deleta a receita
async function excluirReceita() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
    }
    else {
      alert("Usuário não está logado")
      window.location.href = './autenticacao.html';
    }
    let radios = document.getElementsByName("escolha");
    let valueEscolhido = '';
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        valueEscolhido = radios[i].value
      }
    }
  });
  await deleteDoc(doc(db, 'Produtos-docs', valueEscolhido));
  alert("A Receita foi Excluída");
  window.location.href = './index.html';
}
window.excluirReceitaDenfer = async function () {
  excluirReceita();
}

//adm/adicionar-novo.html
//Sobe os dados no Firebase
async function adicionarDados() {
  const dados = dadosParaServ();
  const verifica = await verificaDados(dados.nome);
  if (dados.nome == verifica) {
    alert("A receita já Existe");
  }
  else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        alert("Usuário não está logado")
        window.location.href = './autenticacao.html';
      }
    });
    await setDoc(doc(db, "Produtos-docs", dados.nome), dados);
    alert("Receita adicionada ao catálogo com sucesso com sucesso");
    window.location.href = './index.html';
  }
}
window.adicionarDadosDenfer = async function () {
  adicionarDados();
}

export { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado }