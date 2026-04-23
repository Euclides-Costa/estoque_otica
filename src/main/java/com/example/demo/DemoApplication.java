package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;




import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		System.out.println("\n========================================");
		System.out.println("🚀 SISTEMA DE ESTOQUE PARA ÓTICA");
		System.out.println("========================================");
		System.out.println("✅ Sistema iniciado com sucesso!");
		System.out.println("🔗 API Base: http://localhost:8080/api");
		System.out.println("========================================\n");
	}
}

// ===== MODEL =====
@Entity
class Produto {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nome;
	private String sku;
	private String marca;
	private Integer quantidadeAtual;
	private Integer quantidadeMinima;
	private Double precoVenda;
	private LocalDateTime createdAt;

	public Produto() {}

	// Getters
	public Long getId() { return id; }
	public String getNome() { return nome; }
	public String getSku() { return sku; }
	public String getMarca() { return marca; }
	public Integer getQuantidadeAtual() { return quantidadeAtual; }
	public Integer getQuantidadeMinima() { return quantidadeMinima; }
	public Double getPrecoVenda() { return precoVenda; }
	public LocalDateTime getCreatedAt() { return createdAt; }

	// Setters
	public void setId(Long id) { this.id = id; }
	public void setNome(String nome) { this.nome = nome; }
	public void setSku(String sku) { this.sku = sku; }
	public void setMarca(String marca) { this.marca = marca; }
	public void setQuantidadeAtual(Integer quantidadeAtual) { this.quantidadeAtual = quantidadeAtual; }
	public void setQuantidadeMinima(Integer quantidadeMinima) { this.quantidadeMinima = quantidadeMinima; }
	public void setPrecoVenda(Double precoVenda) { this.precoVenda = precoVenda; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

@Entity
class Lote {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String codigo;
	private Integer quantidade;
	private LocalDate dataValidade;
	private String notaFiscal;

	@ManyToOne
	private Produto produto;

	public Lote() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getCodigo() { return codigo; }
	public void setCodigo(String codigo) { this.codigo = codigo; }
	public Integer getQuantidade() { return quantidade; }
	public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
	public LocalDate getDataValidade() { return dataValidade; }
	public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }
	public String getNotaFiscal() { return notaFiscal; }
	public void setNotaFiscal(String notaFiscal) { this.notaFiscal = notaFiscal; }
	public Produto getProduto() { return produto; }
	public void setProduto(Produto produto) { this.produto = produto; }
}

@Entity
class Movimentacao {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String tipo;
	private Integer quantidade;
	private String motivo;
	private LocalDateTime dataHora;
	private String usuario;

	@ManyToOne
	private Produto produto;

	public Movimentacao() {}

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getTipo() { return tipo; }
	public void setTipo(String tipo) { this.tipo = tipo; }
	public Integer getQuantidade() { return quantidade; }
	public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
	public String getMotivo() { return motivo; }
	public void setMotivo(String motivo) { this.motivo = motivo; }
	public LocalDateTime getDataHora() { return dataHora; }
	public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
	public String getUsuario() { return usuario; }
	public void setUsuario(String usuario) { this.usuario = usuario; }
	public Produto getProduto() { return produto; }
	public void setProduto(Produto produto) { this.produto = produto; }
}

// ===== REPOSITORY =====
interface ProdutoRepository extends JpaRepository<Produto, Long> {
	List<Produto> findByQuantidadeAtualLessThanEqual(Integer minimo);
}

interface LoteRepository extends JpaRepository<Lote, Long> {
	List<Lote> findByProdutoId(Long produtoId);
}

interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
	List<Movimentacao> findByProdutoIdOrderByDataHoraDesc(Long produtoId);
}

// ===== SERVICE =====
@Service
class EstoqueService {

	@Autowired
	private ProdutoRepository produtoRepo;

	@Autowired
	private LoteRepository loteRepo;

	@Autowired
	private MovimentacaoRepository movRepo;

	public Produto cadastrarProduto(Produto produto) {
		produto.setQuantidadeAtual(0);
		produto.setCreatedAt(LocalDateTime.now());
		return produtoRepo.save(produto);
	}

	public List<Produto> listarProdutos() {
		return produtoRepo.findAll();
	}

	public void registrarEntrada(Long produtoId, Integer quantidade, String loteCodigo,
	                             LocalDate validade, String notaFiscal) throws Exception {
		Produto produto = produtoRepo.findById(produtoId)
				.orElseThrow(() -> new Exception("Produto não encontrado"));

		produto.setQuantidadeAtual(produto.getQuantidadeAtual() + quantidade);
		produtoRepo.save(produto);

		Lote lote = new Lote();
		lote.setCodigo(loteCodigo);
		lote.setQuantidade(quantidade);
		lote.setDataValidade(validade);
		lote.setNotaFiscal(notaFiscal);
		lote.setProduto(produto);
		loteRepo.save(lote);

		Movimentacao mov = new Movimentacao();
		mov.setTipo("ENTRADA");
		mov.setQuantidade(quantidade);
		mov.setMotivo("COMPRA");
		mov.setProduto(produto);
		mov.setDataHora(LocalDateTime.now());
		mov.setUsuario("ADMIN");
		movRepo.save(mov);
	}

	public void registrarVenda(Long produtoId, Integer quantidade, String usuario) throws Exception {
		Produto produto = produtoRepo.findById(produtoId)
				.orElseThrow(() -> new Exception("Produto não encontrado"));

		if (produto.getQuantidadeAtual() < quantidade) {
			throw new Exception("Estoque insuficiente. Disponível: " + produto.getQuantidadeAtual());
		}

		produto.setQuantidadeAtual(produto.getQuantidadeAtual() - quantidade);
		produtoRepo.save(produto);

		Movimentacao mov = new Movimentacao();
		mov.setTipo("SAIDA");
		mov.setQuantidade(quantidade);
		mov.setMotivo("VENDA");
		mov.setProduto(produto);
		mov.setDataHora(LocalDateTime.now());
		mov.setUsuario(usuario);
		movRepo.save(mov);
	}

	public List<Produto> getEstoqueBaixo() {
		return produtoRepo.findByQuantidadeAtualLessThanEqual(5);
	}

	public List<Movimentacao> getHistorico(Long produtoId) {
		return movRepo.findByProdutoIdOrderByDataHoraDesc(produtoId);
	}
}

// ===== CONTROLLER =====
@RestController
@RequestMapping("/api")
class EstoqueController {

	@Autowired
	private EstoqueService service;

	@PostMapping("/produto")
	public ResponseEntity<?> cadastrarProduto(@RequestBody Produto produto) {
		try {
			return ResponseEntity.ok(service.cadastrarProduto(produto));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/produtos")
	public List<Produto> listarProdutos() {
		return service.listarProdutos();
	}

	@PostMapping("/entrada")
	public ResponseEntity<?> registrarEntrada(@RequestBody EntradaRequest request) {
		try {
			service.registrarEntrada(request.produtoId, request.quantidade,
					request.loteCodigo, request.validade, request.notaFiscal);
			return ResponseEntity.ok("✅ Entrada registrada!");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("❌ " + e.getMessage());
		}
	}

	@PostMapping("/venda")
	public ResponseEntity<?> registrarVenda(@RequestBody VendaRequest request) {
		try {
			service.registrarVenda(request.produtoId, request.quantidade, request.usuario);
			return ResponseEntity.ok("✅ Venda registrada!");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("❌ " + e.getMessage());
		}
	}

	@GetMapping("/alertas/estoque-baixo")
	public List<Produto> alertasEstoqueBaixo() {
		return service.getEstoqueBaixo();
	}

	@GetMapping("/produto/{id}/historico")
	public List<Movimentacao> historicoProduto(@PathVariable Long id) {
		return service.getHistorico(id);
	}

	static class EntradaRequest {
		public Long produtoId;
		public Integer quantidade;
		public String loteCodigo;
		public LocalDate validade;
		public String notaFiscal;
	}

	static class VendaRequest {
		public Long produtoId;
		public Integer quantidade;
		public String usuario;
	}




	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}






}