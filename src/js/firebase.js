import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
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

/* --------------------FUNÇÃO QUE ATRIBUI O BD A UMA VARIÁVEL---------------------- */
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
  await recebeBanco();
  console.log('Amigo estou aqui');
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
/* --------------------------CREATE---------------------- */
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

//Sobe os dados no Firebase
async function adicionarDados() {
  const modalMsg = document.getElementById("modalSucess");
  const dados = dadosParaServ();
  /*const selectedFile = dados.img;
    const nomeExt = extrairArquivo(selectedFile)
    const imagesRef = ref(storage, `imgs-docs/${dados.nome}/${nomeExt.arquivo}`)
    const metadata = {
      contentType: `image/${nomeExt.extensao}`
    }; */
  const verifica = await verificaDados(dados.nome);
  if (verifica == true) {
    alert("Um Produto de mesmo nome já Existe");
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
      window.mostraModal();
      //window.location.href = './index.html';
    }
  }
}
//ADICIONA EFETIVAMENTE
window.adicionarDadosDenfer = async function () {
  adicionarDados();
}

//Funções auxiliares
function extrairArquivo(Caminho) {
  Caminho = Caminho.replace(/\\/g, "/");
  var Arquivo = Caminho.substring(Caminho.lastIndexOf('/') + 1);
  var Extensao = Arquivo.substring(Arquivo.lastIndexOf('.') + 1);
  return { arquivo: Arquivo, extensao: Extensao };
}

function primeiraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function consultaBanco(q) {
  const querySnapshot = await getDocs(q);
  let values = [];
  querySnapshot.forEach((doc) => {
    values.push(doc.data());
  });
  return values;
}

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

export { init, consultaBanco, primeiraMaiuscula };