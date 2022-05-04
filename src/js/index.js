import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado } from './firebase';

//Configuração
const firebaseConfig = init()

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

