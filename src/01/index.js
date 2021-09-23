const elBox = document.querySelector("#box");

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  switch (state) {
    // Add your state/event transitions here
    // to determine and return the next state
    case "active":
      switch (event) {
        case "TOGGLE":
          return "inactive";
      }
      break;

    case "inactive":
    default:
      switch (event) {
        case "TOGGLE":
          return "active";
      }
      break;
  }
}

// Keep track of your current state
let currentState = undefined;

function send(event) {
  // Determine the next value of `currentState`
  currentState = transition(currentState, event);

  elBox.dataset.state = currentState;
}

elBox.addEventListener("click", () => {
  // send a click event
  send("TOGGLE");
});
