//Imports:
import readline from "readline";

// Setup CLI interface:
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Todo list:
const todos = [];

// AskQuestion Function That Resolves Promises and Provides The Value From CLI:
const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

// Show menu options:
const showMenu = async () => {
  console.log(`
X----------------------------------------------------------------------------------X

 | Please Enter the following keys for the functionality                          |

 | 1: View All Todos [Tasks]                                                      |
 | 2: Add A Todo [Task]                                                           |
 | 3: Update A Todo [Task]                                                        |
 | 4: Delete A Todo [Task]                                                        |
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
      console.log("\nYour Todo Lists:");
      todos.forEach((todo, index) => {
        console.log(`\n${index + 1}. ${JSON.stringify(todo)}`);
      });
      break;

    case 2:
      const taskName = await askQuestion("Enter task name: ");
      const description = await askQuestion("Enter task description: ");
      const newTodo = {
        id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
        taskName,
        description,
        isCompleted: false,
      };
      todos.push(newTodo);
      console.log("\nTask Added Successfully!");
      break;

    case 3:
      const updateId = parseInt(await askQuestion("Enter task id to update: "));
      const todoToUpdate = todos.find((t) => t.id === updateId);
      if (!todoToUpdate) {
        console.log("\nInvalid task id!");
        break;
      }
      todoToUpdate.taskName = await askQuestion("Enter new task name: ");
      todoToUpdate.description = await askQuestion("Enter new description: ");
      const completed = await askQuestion("Is it completed? (yes/no): ");
      todoToUpdate.isCompleted = completed.toLowerCase() === "yes";
      console.log("\nTask Updated Successfully!");
      break;

    case 4:
      const deleteId = parseInt(await askQuestion("Enter task id to delete: "));
      const newTodos = todos.filter((t) => t.id !== deleteId);

      if (newTodos.length === todos.length) {
        console.log("\nInvalid task id!");
        break;
      }

      todos.length = 0;
      todos.push(...newTodos);

      console.log("\nTask Deleted Successfully!");
      break;

    case 0:
      console.log("\nGood Bye! See You Again!");
      rl.close();
      return;

    default:
      console.log("\nPlease provide a valid option!");
  }

  // Show the menu to continue the program:
  showMenu();
};

// Show the menu:
showMenu();
