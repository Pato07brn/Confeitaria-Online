import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { init } from './firebase';

//Configuração
const firebaseConfig = init()

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

async function resultaPesquisa() {
    let consulta = dadosPesquisa();
    if (window.database == undefined) {
        await deferRecebeBanco();
    }
    let database = window.database;
    const q1 = [];
    for (const key1 in database) {
        for (let i = 0; i < consulta.tags.length; i++) {
            database[key1].tags.includes(consulta.tags) == true

        }
        if (database[key1].nome == consulta.nome ||
            database[key1].tempo == consulta.tempo ||
            database[key1].tipo == consulta.tipo ||
            verificaArrays(database[key1].tags, consulta.tags) == true) {
            q1.push(database[key1]);
        }
    }
    const ValueQ1 = q1;
    return ValueQ1;
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

function dadosPesquisa() {
    let values = {
        nome: document.getElementById("nome").value.toLowerCase(),
        tempo: document.getElementById("tempo").value,
        tags: document.getElementById('tags').value.split(" "),
        tipo: document.getElementById("tipo").value
    }
    return values
}

window.buscarDadosPesquisa = async function () {
    const ValueQ1 = await resultaPesquisa();
    prateleiraBusca(ValueQ1);
}

const prateleiraBusca = function (ValueQ1) {
    let elementin = document.getElementById(`resultado-pesquisa`);
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
    let html =
        `<ul class="resultadosRadio">
        <li id="ratioNome">Nome: ${primeiraMaiuscula(consulta.nome)}</li>
        <li id="ratioTags">Nome: ${consulta.tags}</li>
        <li>Tipo: ${consulta.tipo}</li>
        <li>Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
      </ul>`;
    let elementin = document.getElementById(`resultado-pesquisa`);
    elementin.insertAdjacentHTML("afterbegin", html);
}