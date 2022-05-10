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

async function recebeBanco() {
  const produtos = collection(db, "Produtos-docs");
  const pesquisa = query(produtos, where("nome", "!=", ""));
  const querySnapshot = await getDocs(pesquisa);
  let values = [];
  querySnapshot.forEach((doc) => {
    values[doc.id] = doc.data()
  });
  return values;
}

const databse = recebeBanco()

async function consultaBancoCompleto() {
  let consulta = dadosParaServ();
  const produtos = collection(db, "Produtos-docs");

  const q1 = query(produtos,
    where("nome", "==", consulta.nome),
    where("tempo", "==", consulta.tempo),
    where("tipo", "==", consulta.tipo)
  );
  const q2 = query(produtos, where("nome", "==", consulta.nome));
  const q3 = query(produtos, where("tempo", "==", consulta.tempo));
  const q4 = query(produtos, where("tipo", "==", consulta.tipo));
  let q5 = null
  if (consulta.tags.length !== 0) {
    q5 = query(produtos, where("tags", "array-contains-any", consulta.tags));
  }
  const ValueQ1 = await consultaBanco(q1);
  const Values = {
    q2: await consultaBanco(q2),
    q3: await consultaBanco(q3),
    q4: await consultaBanco(q4),
    q5: await consultaBanco(q5),
  };
  return { ValueQ1, Values };
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

//
//Consulta tudo no bd e exibe
window.buscarDados = async function () {
  const { ValueQ1, Values } = await consultaBancoCompleto();
  imprimeResultado(ValueQ1, Values);
}

function imprimeResultado(ValueQ1, Values) {
  let elementin = document.getElementById(`resultado`);
  elementin.innerHTML = '';
  if (ValueQ1.nome == undefined || ValueQ1.nome == null || ValueQ1.nome == '') {
    let html = `<span id="semResultados" >Seguem resultados mais próximos</span>`;
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
    if (Object.keys(Values[key]).length !== 0) {
      exibeResultado(Values[key]);
      for (const key2 in Values[key]) {
        exibeResultado(Values[key][key2]);
      }
    }
    if (document.getElementById("btnSubmit2") !== null) {
      var Btn2 = document.getElementById("btnSubmit2");
      Btn2.classList.remove("beforeCheck");
      Btn2.classList.add("afterCheck");
    }
  }
}

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
    elementin.insertAdjacentHTML("beforeend", html);
  }
}

const auth = getAuth();

//adm/deletar.html
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
    await deleteDoc(doc(db, 'Produtos-docs', valueEscolhido));
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

export { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado }