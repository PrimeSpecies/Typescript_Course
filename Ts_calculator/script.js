// --- Define possible button actions
var ActionType;
(function (ActionType) {
    ActionType["Clear"] = "clear";
    ActionType["Delete"] = "delete";
    ActionType["Calculate"] = "calculate";
})(ActionType || (ActionType = {}));
// --- Correctly typed element references
var display = document.getElementById("display");
var buttons = document.querySelectorAll("input[type='button']");
// --- Ensure display exists
if (!display) {
    throw new Error("Display element not found in the DOM.");
}
// --- Utility functions
function clearDisplay() {
    display.value = "";
}
function deleteLast() {
    display.value = display.value.slice(0, -1);
}
function calculateExpression() {
    try {
        // Using Function constructor for safety
        var result = new Function("return ".concat(display.value))();
        display.value = result.toString();
    }
    catch (_a) {
        display.value = "Error";
    }
}
// --- Main logic
buttons.forEach(function (button) {
    var value = button.dataset.value;
    var action = button.dataset.action;
    button.addEventListener("click", function () {
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
