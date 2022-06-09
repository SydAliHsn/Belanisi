const finalPayBtn = document.querySelector(".final-pay-btn");

const placeOrder = async () => {
  const res = await axios.post("/api/v1/store/placeOrder", {
    userId: "56cb91adc3464f14678934ca",
    repeatRate: 4,
    items: {
      product: "56cb91bdc3465f14678934ca",
      quantity: 2,
      size: "lg",
      color: "red",
    },
    items: {
      product: "56cb91bdc1464f14678934ca",
      quantity: 2,
      size: "lg",
      color: "red",
    },
  });
};

finalPayBtn.addEventListener("click", async function () {
  console.log("orderPlaced");

  await placeOrder();
});
