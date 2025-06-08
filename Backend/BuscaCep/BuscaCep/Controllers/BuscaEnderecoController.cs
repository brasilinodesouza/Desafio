using BuscaCep.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Runtime.ConstrainedExecution;
using System.Text.Json;

namespace BuscaCep.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuscaEnderecoController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public BuscaEnderecoController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet()]
        public async Task<IActionResult> BuscarEnderecoCompleto([FromQuery]string uf, [FromQuery]string municipio, [FromQuery]string logradouro)
        {
            try
            {
                var respostaCep = await _httpClient.GetStringAsync($"https://viacep.com.br/ws/{uf}/{municipio}/{logradouro}/json/");

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                List<ViaCep>? enderecos = JsonSerializer.Deserialize<List<ViaCep>>(respostaCep, options);



                return Ok(enderecos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }

        }
    };
}


