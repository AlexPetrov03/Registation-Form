MIN_PASS_LENGTH = 6;

function validatePassword(password) {
    return password.length >= MIN_PASS_LENGTH;
}

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = form.password.value;
    const repeatPassword = form.repeatPassword.value;

    if (!validatePassword(password)) {
        alert("Invalid password!");
        return;
    }
    if (password !== repeatPassword) {
        alert("The passwords do not match");
        return;
    }

    const formData = `password=${encodeURIComponent(password)}`;

    fetch("/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    }).then(response => response.json()).then(data => {
        alert(data.message);
        if (data.message == "Password changed successfully") {
            fetch("/logout", {
                method: "POST"
            }).then(() => {
                    window.location.href = "login";
            }).catch(error =>{
                    console.error("Logout failed: ", error);
                })
        }
    }).catch(error => console.error("Error:", error));
});
