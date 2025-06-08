const cepInput = document.getElementById("cep");
const cepForm = document.getElementById("cepForm");
const estadoSelect = document.getElementById("estado");
const cidadeInput = document.getElementById("cidade");
const logradouroInput = document.getElementById("logradouro"); 
const estadoCidadeForm = document.getElementById("estadoCidadeForm");
const resultadoDiv = document.getElementById("resultado");
const mensagemErroDiv = document.getElementById("mensagemErro"); 
const BASE_API_URL = "https://localhost:7000"; 


function limpar() {
  resultadoDiv.innerHTML = "";
  if (mensagemErroDiv) {
    mensagemErroDiv.innerText = ""; 
    mensagemErroDiv.style.display = "none"; 
  }
}

// Exibe uma mensagem de erro para o usuário
function Error(message) {
  limpar(); // Limpa resultado antes de exibir um erro
  if (mensagemErroDiv) {
    mensagemErroDiv.innerText = message;
    mensagemErroDiv.style.display = "block"; // Mostra a div de erro
  } else {
    // Fallback caso a div de erro não exista (mas é bom tê-la!)
    resultadoDiv.innerHTML = `<p style="color: red;">${message}</p>`;
  }
}

function pesquisaSomentePeloCEP(address) {
  limpar(); 
  if (!address || address.erro) {
    resultadoDiv.innerHTML =
      "<p>Nenhum endereço encontrado para o CEP fornecido.</p>";
    return;
  }
  resultadoDiv.innerHTML = `
        <h3>Detalhes do Endereço:</h3>
        <p><strong>Região:</strong> ${address.regiao}</p>
        <p><strong>CEP:</strong> ${address.cep}</p>
        <p><strong>Estado:</strong> ${address.uf}</p>
        <p><strong>Estado:</strong> ${address.estado}</p>
        <p><strong>Cidade:</strong> ${address.localidade}</p>
        <p><strong>Bairro:</strong> ${address.bairro}</p>
        <p><strong>Logradouro:</strong> ${address.logradouro}</p>
        <p><strong>Complemento:</strong> ${address.complemento || "N/A"}</p>
        <p><strong>IBGE:</strong> ${address.ibge || "N/A"}</p>
        <p><strong>GIA:</strong> ${address.gia || "N/A"}</p>
        <p><strong>DDD:</strong> ${address.ddd || "N/A"}</p>
        <p><strong>SIAFI:</strong> ${address.siafi || "N/A"}</p>
    `;
}

function pesquisaPorEndereco(addresses) {
  limpar(); 
  if (!addresses || addresses.length === 0) {
    resultadoDiv.innerHTML =
      "<p>Nenhum endereço encontrado para os critérios fornecidos.</p>";
    return;
  }

  let htmlContent = "<h2>Endereços Encontrados:</h2>";
  addresses.forEach((address) => {
    htmlContent += `
            <div class="address-item">
                <p><strong>CEP:</strong> ${address.cep}</p>
                <p><strong>Cidade:</strong> ${address.localidade}</p>
                <p><strong>Bairro:</strong> ${address.bairro}</p>
                <p><strong>Logradouro:</strong> ${address.logradouro}</p>
                <p><strong>Complemento:</strong> ${address.complemento || "N/A"}</p>
                <hr/>
            </div>
        `;
  });
  resultadoDiv.innerHTML = htmlContent;
}

// Busca por CEP
cepForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o comportamento padrão de recarregar a página
  limpar(); 

  // Limpa o CEP, removendo caracteres não numéricos como '-'
  const cep = cepInput.value.replace(/\D/g, "");

  // Validação frontend simples: verifica se o CEP tem 8 dígitos
  if (cep.length !== 8) {
    Error("Por favor, digite um CEP válido com 8 dígitos.");
    return; 
  }

  try {
    // Faz a requisição HTTP para o backend
    const response = await fetch(`${BASE_API_URL}/api/BuscaCep/${cep}`);
    // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({
          message: "Erro ao processar resposta do servidor.",
        }));
      Error(
        errorData.message ||
          `Erro na busca: ${response.status} ${response.statusText}`
      );
      return;
    }

    console.log("Testando", response);
    // Converte a resposta para JSON
    const data = await response.json();

    // Exibe o endereço na tela
    pesquisaSomentePeloCEP(data);
  } catch (error) {
    console.error("Erro na requisição de CEP:", error);
    Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente."
    );
  }
});

// Busca por Endereco
estadoCidadeForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página

  limpar();

  const uf = estadoSelect.value;
  const cidade = cidadeInput.value.trim();
  const logradouro = logradouroInput.value.trim();

  if (!uf || !cidade || !logradouro) {
    Error(
      "Todos os campos (Estado, Cidade, Logradouro) são obrigatórios para esta busca."
    );
    return;
  }

  try {
    const encodedCidade = encodeURIComponent(cidade);
    const encodedLogradouro = encodeURIComponent(logradouro);

    const response = await fetch(
      `${BASE_API_URL}/api/BuscaEndereco?uf=${uf}&municipio=${encodedCidade}&logradouro=${encodedLogradouro}`
    );

    // Verifica se a resposta HTTP foi bem-sucedida
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({
          message: "Erro desconhecido ao processar resposta do servidor.",
        }));
      Error(
        errorData.message ||
          `Erro na busca: ${response.status} ${response.statusText}`
      );
      return;
    }

    const data = await response.json();

    pesquisaPorEndereco(data);
  } catch (error) {
    console.error("Erro na requisição de Endereço:", error);
    Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente."
    );
  }
});
