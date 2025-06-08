using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Diagnostics;
using BuscaCep.Models;

namespace BuscaCep.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuscaCepController : ControllerBase
    {
        private readonly HttpClient _httpClient;


        public BuscaCepController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet("{cep}")]
        public async Task<IActionResult> BuscarCEP(string cep)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(cep) || cep.Length > 8)
                {
                    return BadRequest("CEP Inválido");
                }

                var respostaCep = await _httpClient.GetStringAsync($"https://viacep.com.br/ws/{cep}/json/");

                var cepFormatado = System.Text.Json.JsonSerializer.Deserialize<ViaCep>(respostaCep, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (respostaCep == null)
                {
                    return NotFound("Cep não encontrado");
                }
                return Ok (cepFormatado) ;



            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, "Erro ao consultar o serviço de endereços externo. Tente novamente mais tarde.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }
    }
}
