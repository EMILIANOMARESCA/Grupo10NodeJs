document.getElementById('registerForm').addEventListener('submit', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const subscribe = document.getElementById('subscribe').checked;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        e.preventDefault(); // Prevenir el envío del formulario
        return;
    }

    if (!subscribe) {
        alert('Debes aceptar los términos y condiciones');
        e.preventDefault(); // Prevenir el envío del formulario
        return;
    }

});