import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc } from 'firebase/firestore';

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

//Inicia o Firestire
const db = getFirestore(app);

/*Adiciona dados
function adicionarDados() {
  docRef = setDoc(doc(db, "db", "User3"), {
    Nome: "Bruno",
    Idade: "21",
    Poder: "Fogo"
  });
}
adicionarDados();
*/

//Recebe dados
let Ada = "User1"
let Lara = "User2"
let Bruno = "User3"

async function lerDados(user){
  const recebeDados = await getDoc(doc(db, "db", user));
  console.log("Document data:", recebeDados.data());
  return recebeDados.data();
}

lerDados(Ada);
lerDados(Lara);
lerDados(Bruno);

