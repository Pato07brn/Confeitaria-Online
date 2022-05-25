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
  let consulta = dadosParaServ();
  if (window.database == undefined) {
    await deferRecebeBanco();
  }
  let database = window.database;
  const q1 = [];
  for (const key1 in database) {
    if (database[key1].nome == consulta.nome ||
      database[key1].tempo == consulta.tempo ||
      database[key1].tipo == consulta.tipo ||
      verificaArrays(database[key1].tags, consulta.tags) == true) {
      q1.push(database[key1]);
    }
  }
  const ValueQ1 = q1;
  return { ValueQ1 };
}

function verificaArrays(objetoChaveArray, tags) {
  let condition = false;
  for (let key = 0; key < tags.length; key++) {
    if (objetoChaveArray.includes(tags[key])) {
      condition = true
    }
  }
  return condition
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

//Consulta tudo no bd e exibe
window.buscarDados = async function () {
  const { ValueQ1 } = await consultaBancoCompleto();
  imprimeResultado(ValueQ1);
}

//Lança na tela
function imprimeResultado(ValueQ1) {
  let elementin = document.getElementById(`resultado`);
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
    `<ul class="resultadosRadio">
      <li id="ratioIN"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></li>
      <li id="ratioNome">Nome: ${primeiraMaiuscula(consulta.nome)}</li>
      <li id="ratioTags">Tags: ${array.replace(',', ' ')}</li>
      <li id="tipoTags">Tipo: ${consulta.tipo}</li>
      <li id="tempoTags">Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
    </ul>`;
  if (consulta.nome !== undefined) {
    let elementin = document.getElementById(`resultado`);
    elementin.insertAdjacentHTML("afterbegin", html);
  }
}

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
      alert("Usuário não está logado");
      window.location.href = './autenticacao.html';
    }
  });
  let radios = document.getElementsByName("escolha");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      valueEscolhido = radios[i].value;
    }
  }
  if (login = 1) {
    let database = window.database;
    let deletePath = '';
    for (const key1 in database) {
      if (database[key1].nome == valueEscolhido) {
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
}
window.excluirReceitaDenfer = async function () {
  excluirReceita();
}

//adm/adicionar-novo.html
//Sobe os dados no Firebase
async function adicionarDados() {
  const modalMsg = document.getElementById("infoAdcionou");
  const dados = dadosParaServ();
  let login = 0;
  let vazio = false;
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if(dados.nome == '' || dados.tempo == '' || dados.preco == ''){
          vazio = true;
        }
        login = 1;
      } else {
        alert("Usuário não está logado");
        login = 0;
        window.location.href = './autenticacao.html';
      }
    });
    if (login == 1 && vazio == false) {
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