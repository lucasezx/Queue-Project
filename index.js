const fs = require("fs");
const QueueSystem = require("./queue-project");
const { Select, Input } = require("enquirer");

const FILE_PATH = "./queueData.json";

function saveQueue(queue) {
  const dataToSave = {
    user: "",
    queue: queue.queue.filter((item) => item.user && item.ticket),
    tickets: queue.tickets,
    history: queue.history.filter((item) => item.user && item.ticket),
    nextTicketNumber: queue.nextTicketNumber,
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(dataToSave, null, 2));
}

function loadQueue() {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH);
    const parsedData = JSON.parse(data);

    const queueSystem = new QueueSystem(parsedData.user);

    queueSystem.queue = (parsedData.queue || []).filter(
      (item) => item.user && item.ticket
    );
    queueSystem.tickets = parsedData.tickets || [];
    queueSystem.history = (parsedData.history || []).filter(
      (item) => item.user && item.ticket
    );
    queueSystem.nextTicketNumber = parsedData.nextTicketNumber || 1;

    return queueSystem;
  }
  return new QueueSystem();
}

async function mainMenu() {
  const prompt = new Select({
    name: "Queue",
    message: "Select an option",
    choices: [
      "Request Ticket",
      "Show Queue",
      "Call Next",
      "Average Wait Time",
      "Show Called Tickets",
      "Empty Queue",
      "Exit",
    ],
  });

  const answer = await prompt.run();

  if (answer === "Exit") {
    console.log("Goodbye!");
    return;
  }

  let queue = loadQueue();

  if (answer === "Request Ticket") {
    const userNamePrompt = new Input({
      message: "Enter your name",
      initial: queue.user,
    });
    const userName = await userNamePrompt.run();
    queue.user = userName;
    console.log(queue.requestTicket(queue.tickets.length + 1));
  }

  if (answer === "Show Queue") {
    console.log(`Current queue: ${JSON.stringify(queue.showQueue(), null)}`);
  }

  if (answer === "Call Next") {
    console.log(queue.callNext());
  }

  if (answer === "Average Wait Time") {
    console.log(
      `The average wait time for each ticket is ${queue.averageWaitTimeForAll()} minutes`
    );
  }

  if (answer === "Empty Queue") {
    queue.emptyQueue();
    console.log("Queue has been emptied");
  }

  if (answer === "Show Called Tickets") {
    console.log(
      `Last tickets called: ${JSON.stringify(
        queue.showLastCalledTickets(),
        null,
        2
      )}`
    );
  }

  saveQueue(queue);
  mainMenu();
}

mainMenu();
