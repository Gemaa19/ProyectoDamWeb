// Inicialización del gráfico interactivo exclusivo de Web
function renderizarGraficoWeb() {
    const ctx = document.getElementById('graficoGastosWeb').getContext('2d');
    
    // Si ya existía un gráfico anterior lo destruimos para que no parpadee
    if (window.miGraficoZenit) window.miGraficoZenit.destroy();

    // Creamos un gráfico circular acoplado a la paleta pastel de Gema
    window.miGraficoZenit = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Vivienda', 'Transporte', 'Ocio', 'Comida'],
            datasets: [{
                data: [350, 60, 120, 210], // Aquí meterás los sumOf de tus gastos reales de AWS
                backgroundColor: ['#0D5140', '#E3F2FD', '#FCE4EC', '#FFFFB3'],
                borderColor: '#E0E0E0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    document.getElementById("ia-consejo").innerText = "Tus gastos en Ocio superan el 15% de tus ingresos este mes. Te sugerimos ajustar el presupuesto de la próxima semana.";
}