    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;

        const formData = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        }).then(response => response.json()).then(data => {
            alert(data.message);
            if(data.message === "Login successful"){
                window.location.href = "profile";
            }
        }).catch(error =>{
                console.error("Login failed: ", error);
            })
    });