const elBox = document.querySelector("#box");

const toggleMachine = {
  initial: "inactive",
  states: {
    inactive: {
      TOGGLE: "active",
    },
    active: {
      TOGGLE: "inactive",
    },
  },
};

function interpret(machine) {
  let currentState = machine.initial;

  function transition(state, event) {
    return machine.states[state]?.[event] ?? state;
  }

  function send(event) {
    // Determine the next value of `currentState`
    currentState = transition(currentState, event);

    elBox.dataset.state = currentState;
  }

  return {
    send,
  };
}

const interpreter = interpret(toggleMachine);

elBox.addEventListener("click", () => {
  // send a click event
  interpreter.send("TOGGLE");
});
