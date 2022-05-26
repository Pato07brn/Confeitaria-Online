import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
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

//adm/deletar.html
const auth = getAuth(app);

//Inicia o storage de imagens
const storage = getStorage(app, "gs://doce-amor-1e212.appspot.com/");

async function recebeBanco() {
  const database_denfer = {};
  const produtos = collection(db, "Produtos-docs");
  const pesquisa = query(produtos, where("nome", "!=", ""));
  const querySnapshot = await getDocs(pesquisa);
  querySnapshot.forEach((doc) => {
    database_denfer[doc.id] = doc.data();
  });
  window.database = database_denfer;
}
window.deferRecebeBanco = async function () {
  recebeBanco();
  console.log('Amigo estou aqui');
}


async function consultaBancoCompleto() {
  let consulta = dadosParaConsulta();
  if (window.database == undefined) {
    await deferRecebeBanco();
  }
  let database = window.database;
  const ValueQ1 = [];
  for (const key1 in database) {
    if (database[key1].nome == consulta.nome ||
      database[key1].tempo == consulta.tempo ||
      database[key1].tipo == consulta.tipo ||
      database[key1].tags.includes(consulta.nome) == true) {
      ValueQ1.push(database[key1]);
    }
  }
  return { ValueQ1 };
}

/* function verificaArrays(objetoChaveArray, tags) {
  let condition = false;
  for (let key = 0; key < tags.length; key++) {
    if (objetoChaveArray.includes(tags[key])) {
      condition = true
    }
  }
  return condition
} */

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
async function verificaDados(nomeAdicionar) {
  if (window.database == undefined) {
    await deferRecebeBanco();
  }
  let condition = false;
  let consulta = database
  for (const key1 in consulta) {
    if (consulta[key1].nome == nomeAdicionar) {
      condition = true;
    }
  }
  return condition;
}

//Retorna os dados do formulário
function dadosParaServ() {
  let arrayTags = document.getElementById('tags').value;
  let dadosServ = {
    nome: document.getElementById('nome').value,
    tags: arrayTags.split(","),
    tempo: parseInt(document.getElementById('tempo').value),
    tipo: document.getElementById('tipo').value,
    ativo: document.getElementById('ativo').checked,
    preco: parseFloat(document.getElementById('preco').value),
    descricao: document.getElementById('descricao').value
    //img: document.getElementById('fileimg').value
  }
  return dadosServ;
}

function dadosParaConsulta() {
  let dadosServ = {
    nome: document.getElementById('nome').value,
    tempo: parseInt(document.getElementById('tempo').value),
    tipo: document.getElementById('tipo').value,
    ativo: document.getElementById('ativo').checked,
    preco: parseFloat(document.getElementById('preco').value),
    //img: document.getElementById('fileimg').value
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
  let elementin = document.getElementById('resultado');
  elementin.innerHTML = '';
  for (const key in ValueQ1) {
    if (Object.keys(ValueQ1[key]).length !== 0) {
      exibeResultado(ValueQ1[key]);
    }
    if (document.getElementById("btnSubmit2") !== null) {
      var Btn2 = document.getElementById("btnSubmit2");
      Btn2.classList.remove("beforeCheck");
      Btn2.classList.add("afterCheck");
    }
  }
}

//função auxiliar
function primeiraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//função auxiliar
function exibeResultado(consulta) {
  let array = consulta.tags.toString()
  let html =
    `<tr class="resultadosRadio">
      <td>${primeiraMaiuscula(consulta.nome)}</td>
      <td>${array.replace(',', ', ')}</td>
      <td>${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</td>
      <td>${consulta.tipo == undefined ? "Nada aqui" : consulta.tipo}</td>
      <td><input type="checkbox"${consulta.ativo == false || consulta.ativo == undefined? "" : "checked"}></td>
      <td>${consulta.preco == undefined ? "Nada aqui" : consulta.preco}</td>
      <td>${consulta.descricao == undefined ? "Nada aqui" : consulta.descricao}</td>
      <td>em construção</td>
      <td><button onclick="excluirReceitaDenfer('${consulta.nome}')">deletar</button>
    </tr>`;
    console.log(consulta.ativo);
  //<td id="ratioIN"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></td>
  if (consulta.nome !== undefined) {
    let elementin = document.getElementById(`resultado`);
    elementin.insertAdjacentHTML("afterbegin", html);
  }
  else {
    elementin.insertAdjacentHTML("afterbegin", "<div>Nenhum resultado obtido</div>");
  }
}

//Deleta a receita
async function excluirReceita(codigo) {
  let database = window.database;
  let deletePath = '';
  for (const key1 in database) {
    if (database[key1].nome == codigo) {
      deletePath = key1;
    }
  }
  await deleteDoc(doc(db, 'Produtos-docs', deletePath));
  alert("A Receita foi Excluída");
  delete window.database[deletePath];
  var element = document.getElementById('resultado');
  element.innerHTML = '';
  buscarDados();
}
window.excluirReceitaDenfer = async function (codigo) {
  excluirReceita(codigo);
}

//adm/adicionar-novo.html
//Sobe os dados no Firebase
async function adicionarDados() {
  const modalMsg = document.getElementById("infoAdicionou");
  const dados = dadosParaServ();
  /*const selectedFile = dados.img;
    const nomeExt = extrairArquivo(selectedFile)
    const imagesRef = ref(storage, `imgs-docs/${dados.nome}/${nomeExt.arquivo}`)
    const metadata = {
      contentType: `image/${nomeExt.extensao}`
    }; */
  const verifica = await verificaDados(dados.nome);
  if (verifica == true) {
    alert("A receita já Existe");
  }
  else {
    if (dados.nome == '' || dados.tempo == '' || dados.preco == '') {
      console.log('dados incompletos');
    }
    else {
      console.log('aqui');
      const sobe = await addDoc(collection(db, "Produtos-docs"), dados);
      console.log(sobe.id);
      window.database[sobe.id] = dados;
      //const upload = uploadBytesResumable(imagesRef, selectedFile.file, metadata)
      modalMsg.classList.remove("modal-fechado");
      modalMsg.classList.add("modal-aberto");
      //window.location.href = './index.html';
    }
  }
}
window.adicionarDadosDenfer = async function () {
  adicionarDados();
}

//Função auxiliar
function extrairArquivo(Caminho) {
  Caminho = Caminho.replace(/\\/g, "/");
  var Arquivo = Caminho.substring(Caminho.lastIndexOf('/') + 1);
  var Extensao = Arquivo.substring(Arquivo.lastIndexOf('.') + 1);
  return { arquivo: Arquivo, extensao: Extensao };
}

export { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado, primeiraMaiuscula };