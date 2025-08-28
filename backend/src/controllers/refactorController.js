import runRefactoring from "../services/refactorService.js";

const staticAnalysisResults = `

Sugestões de modernização (em tom de recomendação, descrevendo ações a serem feitas e não como algo já feito).  
Exemplos de estilo:  

- Substituir 'var' por 'let' ou 'const'.  
- Utilizar template literals para concatenação de strings.  
- Considerar separar a classe Produto em um arquivo próprio.  

`;

const legacyCode = `

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class CrudSimplesStruts {

    // Modelo Produto
    static class Produto {
        private int id;
        private String nome;
        private double preco;

        public Produto(int id, String nome, double preco) {
            this.id = id;
            this.nome = nome;
            this.preco = preco;
        }

        public int getId() { return id; }
        public String getNome() { return nome; }
        public double getPreco() { return preco; }

        public void setNome(String nome) { this.nome = nome; }
        public void setPreco(double preco) { this.preco = preco; }

        @Override
        public String toString() {
            return String.format("[%d] %s - R$ %.2f", id, nome, preco);
        }
    }

    // DAO simulado
    static class ProdutoDAO {
        private List<Produto> produtos = new ArrayList<>();
        private int contador = 1;

        public List<Produto> listar() {
            return produtos;
        }

        public void criar(String nome, double preco) {
            produtos.add(new Produto(contador++, nome, preco));
        }

        public Produto buscarPorId(int id) {
            return produtos.stream().filter(p -> p.getId() == id).findFirst().orElse(null);
        }

        public void atualizar(int id, String nome, double preco) {
            Produto p = buscarPorId(id);
            if (p != null) {
                p.setNome(nome);
                p.setPreco(preco);
            }
        }

        public void deletar(int id) {
            produtos.removeIf(p -> p.getId() == id);
        }
    }

    // Simulação do Controller Struts
    public static void main(String[] args) {
        ProdutoDAO dao = new ProdutoDAO();
        Scanner sc = new Scanner(System.in);
        boolean running = true;

        while (running) {
            System.out.println("\nCRUD Produtos:");
            System.out.println("1 - Listar Produtos");
            System.out.println("2 - Criar Produto");
            System.out.println("3 - Editar Produto");
            System.out.println("4 - Deletar Produto");
            System.out.println("0 - Sair");
            System.out.print("Escolha uma opção: ");
            int opcao = sc.nextInt();
            sc.nextLine(); // Consumir Enter

            switch (opcao) {
                case 1:
                    System.out.println("\nLista de Produtos:");
                    dao.listar().forEach(System.out::println);
                    break;
                case 2:
                    System.out.print("Nome do Produto: ");
                    String nome = sc.nextLine();
                    System.out.print("Preço: ");
                    double preco = sc.nextDouble();
                    sc.nextLine();
                    dao.criar(nome, preco);
                    System.out.println("Produto criado!");
                    break;
                case 3:
                    System.out.print("ID do Produto a editar: ");
                    int idEdit = sc.nextInt();
                    sc.nextLine();
                    Produto prodEdit = dao.buscarPorId(idEdit);
                    if (prodEdit != null) {
                        System.out.print("Novo Nome: ");
                        String novoNome = sc.nextLine();
                        System.out.print("Novo Preço: ");
                        double novoPreco = sc.nextDouble();
                        sc.nextLine();
                        dao.atualizar(idEdit, novoNome, novoPreco);
                        System.out.println("Produto atualizado!");
                    } else {
                        System.out.println("Produto não encontrado.");
                    }
                    break;
                case 4:
                    System.out.print("ID do Produto a deletar: ");
                    int idDel = sc.nextInt();
                    sc.nextLine();
                    dao.deletar(idDel);
                    System.out.println("Produto deletado (se existia).");
                    break;
                case 0:
                    running = false;
                    break;
                default:
                    System.out.println("Opção inválida.");
            }
        }
        sc.close();
        System.out.println("Programa finalizado.");
    }
}


`;


const code_leng = "JavaScript";


async function handleRefactorRequest(req, res) {
    try {
        const result = await runRefactoring(code_leng, staticAnalysisResults, legacyCode);

        return res.json({
            codigoRefatorado: result.refactoredCode,
            dicas: result.refactoringTips,
            funcoes: result.functionsAnalysis   
        });
    } catch {
        return res.status(500).json({ error: "Erro ao processar a refatoração." });
    }
}

export default handleRefactorRequest;
