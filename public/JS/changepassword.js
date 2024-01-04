
async function resetPassword() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    console.log(password, confirmPassword);
    
    if (password !== confirmPassword) {
     alert("Password and Confirm Password do not match");
     return;
    }
    console.log(window.location.pathname)
    var parts = window.location.pathname.split('/');
    var id = parts[parts.length - 2];
    var token = parts[parts.length - 1];
    console.log(id, token);
    if (!id || !token) {
     alert("Invalid URL parameters. Unable to reset password.");
     return;
    }
    
    try {
     const response = await axios.post(`/resetpassword/${id}/${token}`, {
         password: password,
         confirmPassword: confirmPassword
     });
    
     if (response.status === 200) {
         alert("Password reset successfully");
         window.location.href="/login"
         // Redirect or perform additional actions as needed
     }
    } catch (error) {
     console.error(error);
     alert("Failed to reset password. Please try again.");
    }
    }
    