const removeItemBtns = document.querySelectorAll(".cart__remove--btn");

const removeItem = () => {
  console.log("removed");
};

removeItemBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    removeItem();
  });
});
