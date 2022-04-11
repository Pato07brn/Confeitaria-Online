import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { isNull, stubString } from 'lodash';

//Configuração
const firebaseConfig = {
    apiKey: "AIzaSyCrC9v2iBY9p_fScTMJgAmGHsfbDXx-5oc",
    authDomain: "doce-amor-1e212.firebaseapp.com",
    projectId: "doce-amor-1e212",
    storageBucket: "doce-amor-1e212.appspot.com",
    messagingSenderId: "10911075617",
    appId: "1:10911075617:web:d7ffc01fcbc5a0b1c88260"
};

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

//Inicia o Auth
const auth = getAuth();

//Faz busca no bd
async function consultaBanco(q) {
    const querySnapshot = await getDocs(q);
    let values = {};
    querySnapshot.forEach((doc) => {
        values = doc.data();
    });
    return values;
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

function exibeResultadoConsulta(consulta) {
    let html =
      `<ul class="resultadosRadio"  >
        <li id="ratioDelete"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></li>
        <li id="ratioNome" value="${consulta.nome}">Nome: ${consulta.nome}</li>
        <li>Tipo: ${consulta.tipo}</li>
        <li>Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
      </ul>`;
    let elementin = document.getElementById("resultado");
    elementin.insertAdjacentHTML("beforeend", html);
  }

//Consulta tudo no bd e exibe para atualizar
window.buscarDadosConsulta = async function () {
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
    const ValueQ1 = await consultaBanco(q1)
    const Values = {
        q2: await consultaBanco(q2),
        q3: await consultaBanco(q3),
        q4: await consultaBanco(q4),
    }
    if (ValueQ1.nome == undefined || ValueQ1.nome == null || ValueQ1.nome == '') {
        let html =
            `<span id="semResultados" >
      Seguem resultados mais próximos
      </span>`;
        let elementin = document.getElementById("resultado");
        elementin.insertAdjacentHTML("afterbegin", html);
    }
    if (Values.q2.nome == ValueQ1.nome && Values.q3.nome == ValueQ1.nome && Values.q4.nome == ValueQ1.nome && Object.keys(ValueQ1).length !== 0) {
        exibeResultadoConsulta(ValueQ1)
        var Btn2 = document.getElementById("btnSubmit2");
        Btn2.classList.remove("beforeCheck");
        Btn2.classList.add("afterCheck");
    }
    for (const key in Values) {
        if (Values[key].nome !== ValueQ1.nome && Values[key].nome !== '' && Values[key].nome !== null && Object.keys(Values[key]).length !== 0) {
            exibeResultadoConsulta(Values[key]);
            var Btn2 = document.getElementById("btnSubmit2");
            Btn2.classList.remove("beforeCheck");
            Btn2.classList.add("afterCheck");
        }
    }
    const ret = {
        a: ValueQ1,
        b: Values
    }
    return ret
}

window.selecionaParaAtualizar = async function () {
    let radios = document.getElementsByName("escolha");
    let valueEscolhido = '';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            valueEscolhido = radios[i].value
        }
    }
    const produtos = collection(db, "Produtos-docs");
    const q = query(produtos, where("nome", "==", valueEscolhido));
    const atualizar = await consultaBanco(q)
    let html = `<form class="atualizar">
    <h4 type="text" id="nomeAt" value="${atualizar.nome}" />${atualizar.nome}</h4>
    <h3>Atualize o tempo de preparo em dias</h3>
    <input type="number" id="tempoAt" placeholder="Insira o tempo de preparo" required value="${atualizar.tempo}"/>
    <h3>Atualize o tipo da receita</h3>
    <span class="tipos">
        <input type="radio" name="tipoAt" value="Doce" /><span>Doce</span>
        <input type="radio" name="tipoAt" value="Torta" /><span>Torta</span>
        <input type="radio" name="tipoAt" value="Bolo" /><span>Bolo</span>
    </span>
    </form>`;
    let elementin = document.getElementById("resultado2")
    elementin.insertAdjacentHTML("afterbegin", html);
}

function dadosParaAtualizar() {
    let radios = document.getElementsByName("tipoAt");
    let valueTipo = '';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            valueTipo = radios[i].value
        }
    }
    let dadosServ = {
        nome: document.getElementById("nomeAt").value,
        tempo: parseInt(document.getElementById("tempoAt").value),
        tipo: valueTipo
    }
    return dadosServ;
}

window.atualizar = async function () {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
        } else {
            alert("Usuário não está logado")
            window.location.href = './autenticacao.html';
        }
    });
    let radios = document.getElementsByName("escolha");
    let valueEscolhido = '';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            valueEscolhido = radios[i].value
        }
    }
    const produtos = collection(db, "Produtos-docs");
    const q1 = query(produtos, where("nome", "==", valueEscolhido));
    const q2 = await consultaBanco(q1);
    let dados = dadosParaAtualizar();

    const produtosDocs = doc(db, "Produtos-docs", q2.nome);
    await updateDoc(produtosDocs, {
        nome: valueEscolhido,
        tempo: dados.tempo,
        tipo: dados.tipo
    });
    alert("Receita atualizada com sucesso");
    window.location.href = './index.html';
}