const socket = io();
socket.on("game-update", () => location.reload());


document
  .querySelectorAll(".kartica.nothing, .kartica.blue, .kartica.red")
  .forEach((card) => {
    card.addEventListener("touchstart", function (e) {
      if (!card.classList.contains("revealed")) {
        e.preventDefault(); // sprijeci da prvi dodir odmah "prodje kroz" na gumb
        document
          .querySelectorAll(".kartica.revealed")
          .forEach((c) => c.classList.remove("revealed"));
        card.classList.add("revealed");
      }
    });
  });

// dodirom bilo gdje izvan kartice sakrij ponovno otkrivene gumbove
document.addEventListener("touchstart", function (e) {
  if (!e.target.closest(".kartica")) {
    document
      .querySelectorAll(".kartica.revealed")
      .forEach((c) => c.classList.remove("revealed"));
  }
});
