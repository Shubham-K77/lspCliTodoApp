//Imports:
import readline from "readline";
import fs from "fs";

//File Path Constant:
const file_path = "./todos.json";

// Setup CLI interface:
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Todo list:
let todos = [];

const loadTodos = () => {
  try {
    if (fs.existsSync(file_path)) {
      const data = fs.readFileSync(file_path, "utf-8");
      todos = JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load todos:", error);
  }
};

// AskQuestion Function That Resolves Promises and Provides The Value From CLI:
const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

//Helper Function To Save Todos In The File:
const saveTodos = () => {
  try {
    fs.writeFileSync(file_path, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Failed to save todos:", error);
  }
};

// Show menu options:
const showMenu = async () => {
  console.log(`
X----------------------------------------------------------------------------------X

 | Please Enter the following keys for the functionality                          |  
 | 1: View All Todos [Tasks]                                                      |
 | 2: Add A Todo [Task]                                                           |
 | 3: Mark A Todo As Complete [Task]                                              |
 | 4: Update An Existing Todo [Task]                                              |
 | 5: Delete A Todo [Task]                                                        |
 | 0: Exit The App                                                                |

X----------------------------------------------------------------------------------X
  `);

  const option = parseInt(await askQuestion("Enter your choice: "));
  await handleInput(option);
};

// Handle menu inputs:
const handleInput = async (option) => {
  switch (option) {
    case 1:
      console.log("\nYour Todo List:");
      todos.forEach((todo, index) => {
        console.log(
          `${index + 1}. [${todo.isCompleted ? "Completed" : "Pending"}] ${
            todo.taskName
          }`
        );
      });
      break;

    case 2:
      const taskName = await askQuestion("Enter task name: ");
      todos.push({
        id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
        taskName,
        isCompleted: false,
      });
      saveTodos();
      console.log("Task added!");
      break;

    case 3:
      const updateIndex =
        parseInt(
          await askQuestion("Enter task number to mark as completed: ")
        ) - 1;
      if (todos[updateIndex]) {
        todos[updateIndex].isCompleted = true;
        saveTodos();
        console.log("Task marked as completed!");
      } else {
        console.log("Invalid task number!");
      }
      break;

    case 4:
      const editIndex =
        parseInt(await askQuestion("Enter task number to update: ")) - 1;

      if (todos[editIndex]) {
        const newName = await askQuestion(
          `Enter new name (Leave blank to keep "${todos[editIndex].taskName}"): `
        );
        const completedStatus = await askQuestion(
          "Mark as completed? (yes/no): "
        );

        // Only update name if not blank
        if (newName.trim()) {
          todos[editIndex].taskName = newName.trim();
        }

        // Toggle completion
        if (completedStatus.toLowerCase() === "yes") {
          todos[editIndex].isCompleted = true;
        } else if (completedStatus.toLowerCase() === "no") {
          todos[editIndex].isCompleted = false;
        }

        saveTodos();
        console.log("Task updated!");
      } else {
        console.log("Invalid task number!");
      }
      break;

    case 5:
      const deleteIndex =
        parseInt(await askQuestion("Enter task number to delete: ")) - 1;
      if (todos[deleteIndex]) {
        todos.splice(deleteIndex, 1);
        saveTodos();
        console.log("Task deleted!");
      } else {
        console.log("Invalid task number!");
      }
      break;

    case 0:
      console.log("\nGoodbye!");
      rl.close();
      return;

    default:
      console.log("❗ Please enter a valid option.");
  }

  showMenu();
};

//Load the file:
loadTodos();
// Show the menu:
showMenu();
