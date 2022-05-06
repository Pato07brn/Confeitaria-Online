import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { init, consultaBanco, consultaBancoCompleto, imprimeResultado } from './firebase';

//Configuração
const firebaseConfig = init()

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

async function resultaPesquisa() {
    let consulta = dadosPesquisa();
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

function dadosPesquisa() {
    let values = {
        nome: document.getElementById("nome").value,
        tempo: document.getElementById("tempo").value,
        tags: document.getElementById('tags').value.split(" "),
        tipo: document.getElementById("tipo").value
    }
    return values
}

window.buscarDadosPesquisa = async function () {
    const { ValueQ1, Values } = await resultaPesquisa();
    console.log(Values);
    prateleiraBusca(ValueQ1, Values);
}

const prateleiraBusca = function (ValueQ1, Values) {
    let elementin = document.getElementById(`resultado-pesquisa`);
    elementin.innerHTML = '';
    if (Values.q2.nome == ValueQ1.nome && Values.q3.nome == ValueQ1.nome && Values.q4.nome == ValueQ1.nome && Object.keys(ValueQ1).length !== 0) {
        exibeResultado(ValueQ1);
    }
    for (const key in Values) {
        if (Values[key].nome !== ValueQ1.nome && Values[key].nome !== '' && Values[key].nome !== null && Object.keys(Values[key]).length !== 0) {
            exibeResultado(Values[key]);
        }
        for (const key2 in Values[key]) {
            exibeResultado(Values[key][key2]);
        }
    }
    if (ValueQ1.nome == undefined || ValueQ1.nome == null || ValueQ1.nome == '') {
        let html = `<span id="semResultados">Seguem resultados mais próximos</span>`;
        let elementin = document.getElementById(`resultado-pesquisa`);
        elementin.insertAdjacentHTML("afterbegin", html);
    }
}

function exibeResultado(consulta) {
    console.log(consulta);
    let html =
        `<ul class="resultadosRadio">
        <li id="ratioNome">Nome: ${consulta.nome}</li>
        <li id="ratioTags">Nome: ${consulta.tags}</li>
        <li>Tipo: ${consulta.tipo}</li>
        <li>Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
      </ul>`;
    let elementin = document.getElementById(`resultado-pesquisa`);
    elementin.insertAdjacentHTML("afterbegin", html);
}
