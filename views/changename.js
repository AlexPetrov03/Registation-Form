function validateName(name){
    let regex = /^[a-zA-Z ]{2,30}$/;
    return regex.test(name);
}

    const form = document.querySelector("form");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();

        const firstName = form.firstname.value;
        const lastName = form.lastname.value;

        if(!validateName(firstName)){
            alert("First name is not valid!");
            return;
        }

        if(!validateName(lastName)){
            alert("Last name is not valid!");
            return;
        }

        const formData = `firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

        fetch("/change-name", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        }).then(response => response.json()).then(data => {
            alert(data.message);
            if(data.message == "Names changed successfully") window.location.href = "profile";
        }).catch(error => console.error("Error:", error));
    });