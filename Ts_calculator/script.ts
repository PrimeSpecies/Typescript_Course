// Define possible button actions
enum ActionType {
  Clear = "clear",
  Delete = "delete",
  Calculate = "calculate",
}

//  Correctly typed element references
const display = document.getElementById("display") as HTMLInputElement;
const buttons = document.querySelectorAll<HTMLInputElement>("input[type='button']");

//  Ensure display exists
if (!display) {
  throw new Error("Display element not found in the DOM.");
}

//  Utility functions
function clearDisplay(): void {
  display.value = "";
}

function deleteLast(): void {
  display.value = display.value.slice(0, -1);
}

function calculateExpression(): void {
  try {
    // Using Function constructor for safety
    const result = new Function(`return ${display.value}`)();
    display.value = result.toString();
  } catch {
    display.value = "Error";
  }
}

// Main logic
buttons.forEach((button) => {
  const value = button.dataset.value;
  const action = button.dataset.action as ActionType | undefined;

  button.addEventListener("click", () => {
    switch (action) {
      case ActionType.Clear:
        clearDisplay();
        break;

      case ActionType.Delete:
        deleteLast();
        break;

      case ActionType.Calculate:
        calculateExpression();
        break;

      default:
        if (value) {
          display.value += value;
        }
    }
  });
});
