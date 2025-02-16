async function carregarClientes() {
    try {
        const response = await fetch("http://localhost:8080/clientes"); // Faz uma requisição GET para obter a lista de clientes
        const clientes = await response.json(); // Converte a resposta para JSON
        const tbody = document.getElementById("clientesTable"); // Obtém o elemento tbody da tabela de clientes
        tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela

        // Itera sobre a lista de clientes e cria uma linha para cada cliente
        clientes.forEach(cliente => {
            const tr = document.createElement("tr"); // Cria um elemento tr (linha da tabela)
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.afinidade}</td>
                <td>${cliente.imagem ? `<img src="/uploads/${cliente.imagem}" width="50">` : "Sem imagem"}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm btn-editar" data-id="${cliente.id}">
                        Editar
                    </button>
                    <button type="button" class="btn btn-danger btn-sm btn-excluir" data-id="${cliente.id}">
                        Excluir
                    </button>
                </td>
            `; // Define o conteúdo HTML da linha
            tbody.appendChild(tr); // Adiciona a linha à tabela
        });

        // Adiciona listeners para os botões de editar e excluir
        document.querySelectorAll(".btn-editar").forEach(button => {
            button.addEventListener("click", editarCliente);
        });
        document.querySelectorAll(".btn-excluir").forEach(button => {
            button.addEventListener("click", excluirCliente);
        });

    } catch (error) {
        console.error("Erro ao carregar clientes:", error); // Exibe um erro no console se a requisição falhar
    }
}

async function editarCliente(event) {
    const id = parseInt(event.target.getAttribute("data-id"), 10);
    document.getElementById("clienteIdBusca").value = id; // Move o ID do cliente para o campo clienteIdBusca
    try {
        const response = await fetch(`http://localhost:8080/clientes/${id}`);
        const cliente = await response.json();
        document.getElementById("clienteId").value = cliente.id;
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("email").value = cliente.email;
        document.getElementById("telefone").value = cliente.telefone;
        document.getElementById("afinidade").value = cliente.afinidade;
    } catch (error) {
        console.error("Erro ao carregar cliente:", error);
    }
}

async function excluirCliente(event) {
    const id = parseInt(event.target.getAttribute("data-id"), 10);
    try {
        const response = await fetch(`http://localhost:8080/clientes/${id}`, {
            method: "DELETE"
        });
        const result = await response.text();
        alert(result);
        document.getElementById("clienteIdBusca").value = ""; // Limpa o campo clienteIdBusca
        carregarClientes();
    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
    }
}

document.getElementById("clienteForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    const formData = new FormData(e.target); // Cria um FormData com os dados do formulário
    const id = document.getElementById("clienteId").value;

    try {
        const response = await fetch(`http://localhost:8080/clientes${id ? `/${id}` : ""}`, {
            method: id ? "PUT" : "POST",
            body: formData
        }); // Faz uma requisição POST para cadastrar um novo cliente ou PUT para atualizar um cliente existente

        const result = await response.text(); // Obtém a resposta como texto
        alert(result); // Exibe a resposta em um alerta

        e.target.reset(); // Limpa o formulário
        document.getElementById("clienteIdBusca").value = ""; // Limpa o campo clienteIdBusca
        carregarClientes(); // Atualiza a lista de clientes
    } catch (error) {
        console.error(`Erro ao ${id ? "atualizar" : "cadastrar"} cliente:`, error); // Exibe um erro no console se a requisição falhar
    }
});

// Função para buscar cliente pelo ID e preencher o formulário
document.getElementById("buscarCliente").addEventListener("click", async () => {
    const id = parseInt(document.getElementById("clienteIdBusca").value, 10);
    if (!id) {
        alert("Por favor, insira um ID de cliente.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/clientes/${id}`);
        if (!response.ok) {
            throw new Error("Cliente não encontrado");
        }
        const cliente = await response.json();
        document.getElementById("clienteId").value = cliente.id;
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("email").value = cliente.email;
        document.getElementById("telefone").value = cliente.telefone;
        document.getElementById("afinidade").value = cliente.afinidade;
    } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        alert("Erro ao buscar cliente: " + error.message);
    }
});

// Carrega a lista de clientes quando a página é carregada
window.onload = carregarClientes;