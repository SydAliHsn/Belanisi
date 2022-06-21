const sidebar = document.querySelector(".sidebar");
const sidebarBtn = document.querySelector(".sidebarBtn");

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  if (sidebar.classList.contains("active")) {
    sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
});

const getOrders = async () => {
  const res = await fetch("/api/v1/orders");
  const { data } = await res.json();

  return data.orders;
};

const getUsers = async () => {
  const res = await fetch("/api/v1/users");
  const { data } = await res.json();

  return data.users;
};

const getProducts = async () => {
  const res = await fetch("/api/v1/users");
  const { data } = await res.json();

  return data.users;
};
