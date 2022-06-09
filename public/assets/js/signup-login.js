const loginForm = document.querySelector(".form--login");
const loginEmail = document.querySelector(".login--email");
const loginPassword = document.querySelector(".login--password");

const signupForm = document.querySelector(".form--signup");
const signupName = document.querySelector(".signup--name");
const signupEmail = document.querySelector(".signup--email");
const signupRole = document.querySelector(".signup--role");
const signupPassword = document.querySelector(".signup--password");
const signupPasswordConfirm = document.querySelector(
  ".signup--password-confirm"
);

const login = async (email, password) => {
  return await axios.post("/api/v1/user/login", {
    email,
    password,
  });
};

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await login(loginEmail.value, loginPassword.value);

  console.log(res);
});

const signup = async (name, email, password, passwordConfirm, role) => {
  return await axios.post("/api/v1/user/signup", {
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
};

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await signup(
    signupName.value,
    signupEmail.value,
    signupPassword.value,
    signupPasswordConfirm.value,
    signupRole.value || "customer"
  );

  console.log(res);
});
