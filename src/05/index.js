import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const machine = createMachine(
  {
    initial: "idle",
    // Set the initial context
    context: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
    },
    states: {
      idle: {
        on: {
          mousedown: {
            // Assign the point
            target: "dragging",
            actions: "recordMouseLocation",
          },
        },
      },
      dragging: {
        on: {
          mousemove: {
            // Assign the delta
            // (no target!)
            actions: "recordMouseMoveDelta",
          },
          mouseup: {
            // Assign the position
            target: "idle",
            actions: "setRestPosition",
          },
          keyup: {
            actions: "resetPosition",
          },
        },
      },
    },
  },
  {
    actions: {
      recordMouseLocation: assign({
        px: (context, event) => {
          return event.clientX;
        },
        py: (context, event) => {
          return event.clientY;
        },
      }),
      recordMouseMoveDelta: assign({
        dx: (context, event) => {
          return event.clientX - context.px;
        },
        dy: (context, event) => {
          return event.clientY - context.py;
        },
      }),
      setRestPosition: assign({
        x: (context, event) => {
          return context.x + context.dx;
        },
        y: (context, event) => {
          return context.y + context.dy;
        },
        dx: 0,
        dy: 0,
      }),
      resetPosition: assign((context, event) => {
        if (event.key === "Escape") {
          return {
            dx: 0,
            dy: 0,
          };
        }
      }),
    },
  }
);

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody
elBox.addEventListener("mousedown", service.send);
elBody.addEventListener("mousemove", service.send);
elBody.addEventListener("mouseup", service.send);
elBody.addEventListener("keyup", service.send);
