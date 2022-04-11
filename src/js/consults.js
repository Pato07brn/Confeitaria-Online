
function exibeResultado(consulta) {
    let count = 0;
    console.log(consulta);
    let html =
      `<ul class="resultadosRadio"  >
        <li id="ratioDelete"><input type="radio" id="ratioChose" name="escolha" value="${consulta.nome}"/></li>
        <li id="ratioNome">Nome: ${consulta.nome}</li>
        <li>Tipo: ${consulta.tipo}</li>
        <li>Tempo: ${consulta.tempo} ${consulta.tempo > 1 ? "Dias" : "Dia"}</li>
      </ul>`;
    var elementin = document.getElementById(`resultado`);
    elementin.insertAdjacentHTML("beforeend", html);
  }
  
  //Consulta tudo no bd e exibe
  window.buscarDados = async function () {
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
      var elementin = document.getElementById(`resultado`);
      elementin.insertAdjacentHTML("afterbegin", html);
    }
    if (Values.q2.nome == ValueQ1.nome && Values.q3.nome == ValueQ1.nome && Values.q4.nome == ValueQ1.nome && Object.keys(ValueQ1).length !== 0) {
      exibeResultado(ValueQ1)
      var Btn2 = document.getElementById("btnSubmit2");
      Btn2.classList.remove("beforeCheck");
      Btn2.classList.add("afterCheck");
    }
    for (const key in Values) {
      if (Values[key].nome !== ValueQ1.nome && Values[key].nome !== '' && Values[key].nome !== null && Object.keys(Values[key]).length !== 0) {
        exibeResultado(Values[key]);
        var Btn2 = document.getElementById("btnSubmit2");
        Btn2.classList.remove("beforeCheck");
        Btn2.classList.add("afterCheck");
      }
    }
  }