document.getElementById("contact").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("message").value;

  // Simula el envío del correo y muestra un mensaje de confirmación
  alert("Tu mensaje ha sido enviado. Pronto nos pondremos en contacto contigo.");

  // Redirige a la página principal o a donde quieras
  window.location.href = "../../index.html";
});
