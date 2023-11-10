document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form[action='/reset-password']");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    // Aquí podrías hacer una solicitud al servidor para iniciar el proceso de restablecimiento de contraseña.
    // Pero por ahora, simplemente mostraremos un mensaje al usuario.

    alert(`Se ha enviado un correo a ${email} con instrucciones para restablecer tu contraseña.`);

    // Redirige al usuario a la página principal o a donde quieras.
    window.location.href = "../../index.html";
  });
});
