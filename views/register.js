const MIN_PASS_LENGTH = 6;

    let password = document.getElementById("password");
    let strength = document.getElementById("strength");
    let strengthContainer = document.getElementById("strength-container");
    let widthStrength = 
    ["1%", "25%", "50%", "75%", "100%"];
    let colorStrength = 
    ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

    password.oninput = ()=>{
        let value = password.value;
        let strengthIndex = 0;

        strengthContainer.style.display = value.length > 0 ? "block" : "none";
        
        if(value.length >= MIN_PASS_LENGTH){
            let passwordTest = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^0-9a-zA-Z]/];
            passwordTest.forEach(element => {
                if(element.test(value)){
                    strengthIndex++;
                }
            });

        }

        strength.style.width = widthStrength[strengthIndex];
        strength.style.backgroundColor = colorStrength[strengthIndex];
    };

function validatePassword(password){
    return password.length >= MIN_PASS_LENGTH;
}

function validatePasswordMatching(password, password2){
    return password === password2;
}

function validateEmail(email){
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailReg.test(email);
}

function validateName(name){
    let regex = /^[a-zA-Z ]{2,30}$/;
    return regex.test(name);
}

function validateCaptcha(input){
    return text === input;
}

    const form = document.querySelector("form");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();

        const email = form.email.value;
        const password = form.password.value;
        const repeatPassword = form.repeatpassword.value;
        const fname = form.firstname.value;
        const lname = form.lastname.value;
        const captchaInput = form.input.value;

        if(!validateEmail(email)){
            alert("Incorrect Email!");
            return;
        }

        if(!validateName(fname) || !validateName(lname)){
            alert("Incorrect name!");
            return;
        }

        if(!validatePassword(password)){
            alert("Password not long enough!");
            return;
        }

        if(!validatePasswordMatching(password, repeatPassword)){
            alert("The passwords need to be the same!");
            return;
        }

        if(!validateCaptcha(captchaInput)){
            alert("The captcha is incorrect!");
            triggerFunction();
            return;
        }
        const formData = `email=${encodeURIComponent(email)}&fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}&password=${encodeURIComponent(password)}`;

        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        }).then(response => response.json()).then(data => {
            alert(data.message);
            if(data.message == "Registration successful") window.location.href = "login";
        }).catch(error => console.error("Error:", error));
    });