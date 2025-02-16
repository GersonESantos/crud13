

        async function carregarClientes() {
            try {
                const response = await fetch("http://localhost:8080/clientes");
                const clientes = await response.json();
                const tbody = document.getElementById("clientesTable");
                tbody.innerHTML = "";

                clientes.forEach(cliente => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.telefone}</td>
                        <td>${cliente.afinidade}</td>
                        <td>${cliente.imagem ? `<img src="/uploads/${cliente.imagem}" width="50">` : "Sem imagem"}</td>
                      <td>
                    <button type="button" class="btn btn-danger btn-sm btn-excluir" data-id="${cliente.id}">
                        Excluir
                    </button>
                </td>  
                    `;
                    tbody.appendChild(tr);
                });

            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        }

        document.getElementById("clienteForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            try {
                const response = await fetch("http://localhost:8080/clientes", {
                    method: "POST",
                    body: formData
                });

                const result = await response.text();
                alert(result);

                e.target.reset(); // Limpa o formulário
                carregarClientes(); // Atualiza a lista de clientes
            } catch (error) {
                console.error("Erro ao cadastrar cliente:", error);
            }
        });

        window.onload = carregarClientes
