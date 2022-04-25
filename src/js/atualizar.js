import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { init, dadosParaServ, consultaBanco, consultaBancoCompleto, imprimeResultado } from './firebase';

//Configuração
const firebaseConfig = init()

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

//Inicia o Auth
const auth = getAuth();

//Consulta tudo no bd e exibe para atualizar
window.buscarDadosConsulta = async function () {
    const { ValueQ1, Values } = await consultaBancoCompleto();
    imprimeResultado(ValueQ1, Values);
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
    let html =
        `<form class="atualizar">
        <h3>Atualize o nome da receita</h3>
        <input type="text" id="nome" value="${atualizar.nome}" />
        <h3>Atualize o tempo de preparo em dias</h3>
        <input type="number" id="tempo" placeholder="Insira o tempo de preparo" required value="${atualizar.tempo}"/>
        <h3>Atualize o tipo da receita</h3>
        <span class="tipos">
            <input type="radio" name="tipo" value="Doce" /><span>Doce</span>
            <input type="radio" name="tipo" value="Torta" /><span>Torta</span>
            <input type="radio" name="tipo" value="Bolo" /><span>Bolo</span>
        </span>
    </form>`;
    let elementin = document.getElementById("adicionar")
    elementin.innerHTML = html;
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
    let dados = dadosParaServ();

    const produtosDocs = doc(db, "Produtos-docs", q2.nome);
    await updateDoc(produtosDocs, {
        nome: valueEscolhido,
        tempo: dados.tempo,
        tipo: dados.tipo
    });
    alert("Receita atualizada com sucesso");
    window.location.href = './index.html';
}