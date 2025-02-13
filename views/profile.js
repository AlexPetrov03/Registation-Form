window.onload = () => {
    getProfile();

    document.getElementById("logout").onclick = ()=>{
        fetch("/logout", {
            method: "POST"
        }).then(response => response.json()).then(data => {
            alert(data.message);
            if(data.message === "Logout successful"){
                window.location.href = "login";
            }
        }).catch(error =>{
                console.error("Logout failed: ", error);
            })
    }
};

document.getElementById("change-name").onclick = ()=>{
    window.location.href = "/changename";
}

document.getElementById("change-password").onclick = ()=>{
    window.location.href = "/changepassword";
}

function getProfile() {
    fetch("/profile-fetch-data", { method: "GET", credentials: "include" })
        .then(response => {
            if(!response.ok){
                throw new Error("Unauthorized access.")
            }
            return response.json();
        })
        .then(data => {
            if (data.user) {
                document.getElementById("welcome").innerText = `Welcome, ${data.user.name}.`;
            } else {
                alert("Not logged in");
            }
        })
        .catch(error => console.error("Error fetching profile:", error));
}
