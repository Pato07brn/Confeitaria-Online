import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { init, dadosParaServ, consultaBancoCompleto, imprimeResultado, primeiraMaiuscula } from './firebase';

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
    const { ValueQ1 } = await consultaBancoCompleto();
    imprimeResultado(ValueQ1);
}

window.selecionaParaAtualizar = async function () {
    let radios = document.getElementsByName("escolha");
    let valueEscolhido = '';
    let q1 = {}
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            valueEscolhido = radios[i].value
        }
    }
    for (const key1 in database) {
        if (database[key1].nome == valueEscolhido) {
            q1 = database[key1];
        }
    }
    const atualizar = q1
    console.log(atualizar);
    let nome = atualizar.nome
    let tags = atualizar.tags.toString()
    let html =
        `<h3>Atualize o nome da receita</h3>
        <input type="text" id="nome" value="${primeiraMaiuscula(nome)}" />
        <h3>Atualize as Tags de pesquisa</h3>
        <input type="text" id="tags" placeholder="Insira as Tags de pesquisa" value="${tags.replace(",", " ")}"/>
        <h3>Atualize o tempo de preparo em dias</h3>
        <input type="number" id="tempo" placeholder="Insira o tempo de preparo" required value="${atualizar.tempo}"/>
        <h3>Atualize o tipo da receita</h3>
        <span class="tipos">
            <input type="radio" name="tipo" value="Doce" /><span>Doce</span>
            <input type="radio" name="tipo" value="Torta" /><span>Torta</span>
            <input type="radio" name="tipo" value="Bolo" /><span>Bolo</span>
        </span>`;
    let elementin = document.getElementById("adicionar")
    elementin.innerHTML = html;
}


window.atualizar = async function () {
    let login = 0;
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            login = 1;
        } else {
            alert("Usuário não está logado")
            login = 0;
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
    const q2 = await getDocs(q1);
    let dados = dadosParaServ();
    if (login == 1) {
        let id = ''
        q2.forEach((doc) => {
            id = doc.id
        });
        const produtosDocs = doc(db, "Produtos-docs", id);
        await updateDoc(produtosDocs, {
            nome: dados.nome,
            tags: dados.tags,
            tempo: dados.tempo,
            tipo: dados.tipo
        });
        alert("Receita atualizada com sucesso");
        window.location.href = './index.html';
    }
}