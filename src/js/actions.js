import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { init } from './firebase';

//Configuração
const firebaseConfig = init()

//Inicia o Firebase
const app = initializeApp(firebaseConfig);

//Inicia o Firestore
const db = getFirestore(app);

//Inicia o Auth
const auth = getAuth();


/* --------------------------READ---------------------- */
//Consulta tudo no bd e exibe para atualizar
window.buscarDados = async function () {
    const { ValueQ1 } = await consultaBancoCompleto();
    imprimeResultado(ValueQ1);
}

//Retorna dados do fomulário de consulta
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

//Faz a consulta na variável global
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

//Base de impressão
function exibeResultado(consulta) {
    let array = consulta.tags.toString()
    let html =
        `
      <tr id="${consulta.nome}">
        <td><input type="text" value="${consulta.nome}" disabled ></td>
        <td><input type="text" value="${consulta.tags}" disabled ></td>
        <td><input type="number" min="1" value="${consulta.tempo}" disabled></td>
        <td><select disabled><option>${consulta.tipo == undefined ? "Nada aqui" : consulta.tipo}</option></select></td>
        <td><input type="checkbox" ${consulta.ativo == false || consulta.ativo == undefined ? "" : "checked"} disabled></td>
        <td><input type="number" min="0.01" value="${consulta.preco == undefined ? 0.01 : consulta.preco}" disabled></td>
        <td><input type="text" value="${consulta.descricao == undefined ? "Nada aqui" : consulta.descricao}" disabled></td>
        <td>em construção</td>
        <td id="acoes${consulta.nome}"><button class="deletar" onclick="confirmaDeletar('${consulta.nome}')">Deletar</button><button class="atualizar" onclick="selecionaParaAtualizar('${consulta.nome}')">Atualizar</button></td>
      </tr>
      `;
    //<td id="ratioIN"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></td>
    if (consulta.nome !== undefined) {
        let elementin = document.getElementById(`resultado`);
        elementin.insertAdjacentHTML("afterbegin", html);
    }
    else {
        elementin.insertAdjacentHTML("afterbegin", "<div>Nenhum resultado obtido</div>");
    }
}


/* --------------------------UPDATE---------------------- */
//Habilita os campos para atualizar
window.selecionaParaAtualizar = async function (nome) {
    let atualizar = {}
    for (const key1 in database) {
        if (database[key1].nome == nome) {
            atualizar = database[key1];
        }
    }
    let html =
        `<tr id="${atualizar.nome}">
      <td><input type="text" value="${atualizar.nome}" id="nome_${atualizar.nome}"></td>
      <td><input type="text" value="${atualizar.tags}"id="tags_${atualizar.nome}"></td>
      <td><input type="number" min="1" value="${atualizar.tempo}"id="tempo_${atualizar.nome}"></td>
      <td><select id="tipo_${atualizar.nome}">
      <option value="${atualizar.tipo == undefined ? "Nada aqui" : atualizar.tipo}">${atualizar.tipo == undefined ? "Nada aqui" : atualizar.tipo}</option>
      <option value="Teste">Teste</option>
      <option value="Doce">Doce</option>
      <option value="Bolo">Bolo</option>
      <option value="Torta">Torta</option>
      </select></td>
      <td><input type="checkbox" ${atualizar.ativo == false || atualizar.ativo == undefined ? "" : "checked"} id="ativo_${atualizar.nome}"></td>
      <td><input type="number" min="0.01" value="${atualizar.preco == undefined ? 0.01 : atualizar.preco}" id="preco_${atualizar.nome}"></td>
      <td><input type="text" value="${atualizar.descricao == undefined ? "Nada aqui" : atualizar.descricao}" id="descricao_${atualizar.nome}"></td>
      <td>em construção</td>
      <td id="acoes${atualizar.nome}">
      <button class="confirma" onclick="atualizar('${atualizar.nome}')">Confirmar</button>
      <button class="cancela" onclick="cancela('${atualizar.nome}')">Cancelar</button>
      </td>
    </tr>`;
    let elementin = document.getElementById(atualizar.nome)
    elementin.innerHTML = html;
}

//Retorna os dados do formulário para atualizar
function dadosParaAtualizar(id) {
    let arrayTags = document.getElementById('tags_' + id).value;
    let dadosServ = {
        nome: document.getElementById('nome_' + id).value,
        tags: arrayTags.split(","),
        tempo: parseInt(document.getElementById('tempo_' + id).value),
        tipo: document.getElementById('tipo_' + id).value,
        ativo: document.getElementById('ativo_' + id).checked,
        preco: parseFloat(document.getElementById('preco_' + id).value),
        descricao: document.getElementById('descricao_' + id).value
        //img: document.getElementById('fileimg').value
    }
    return dadosServ;
}

//Atualiza efetivamente
window.atualizar = async function (nome) {
    atualizarDenfer(nome);
}
const atualizarDenfer = async function (nome) {
    let atualizar = ''
    for (const key1 in database) {
        if (database[key1].nome == nome) {
            atualizar = key1;
        }
    }
    let dados = dadosParaAtualizar(nome);
    console.log(dados);
    const produtosDocs = doc(db, "Produtos-docs", atualizar);
    await updateDoc(produtosDocs, {
        nome: dados.nome,
        tags: dados.tags,
        tempo: dados.tempo,
        tipo: dados.tipo,
        ativo: dados.ativo,
        preco: dados.preco,
        descricao: dados.descricao
    });
    delete window.database[atualizar];
    window.database[atualizar] = dados;
    alert("Produto atualizada com sucesso");
    window.buscarDados();
    //window.location.href = './index.html';
    return null;
}

/* --------------------------DELETE---------------------- */
//Habilita o botão de exclusão
window.confirmaDeletar = function (codigo) {
    let element = document.getElementById('acoes' + codigo);
    let html =
        `
      <button class="confirma" onclick="excluirProdutoDenfer('${codigo}')">Confirmar</button>
      <button class="cancela" onclick="cancela('${codigo}')">Cancelar</button>
    `;
    element.innerHTML = html;
}

//Cancela a exclusão e atualização
window.cancela = function (codigo) {
    window.buscarDados();
}

//Exclui
async function excluirProduto(codigo) {
    let database = window.database;
    let deletePath = '';
    for (const key1 in database) {
        if (database[key1].nome == codigo) {
            deletePath = key1;
        }
    }
    await deleteDoc(doc(db, 'Produtos-docs', deletePath));
    alert("O Produto foi Excluído");
    delete window.database[deletePath];
    var element = document.getElementById('resultado');
    element.innerHTML = '';
    window.buscarDados();
}

//Exclui efetivamente
window.excluirProdutoDenfer = async function (codigo) {
    excluirProduto(codigo);
}