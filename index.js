const fs = require("fs");
const QueueSystem = require("./queue-project");
const { Select, Input } = require("enquirer");

const FILE_PATH = "./queueData.json";

function saveQueue(queue) {
  const dataToSave = {
    user: "",
    queue: queue.queue.filter((item) => {
      return item.user && item.ticket && item.section;
    }),
    tickets: queue.tickets,
    history: queue.history.filter((item) => item.user && item.ticket),
    sections: queue.sections,
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(dataToSave, null, 2));
}

function loadQueue() {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH);
    const parsedData = JSON.parse(data);

    const queueSystem = new QueueSystem(parsedData.user);

    queueSystem.queue = (parsedData.queue || []).filter(
      (item) => item.user && item.ticket && item.section
    );
    queueSystem.tickets = parsedData.tickets || [];
    queueSystem.history = (parsedData.history || []).filter(
      (item) => item.user && item.ticket
    );
    queueSystem.nextTicketNumber = parsedData.nextTicketNumber || 1;
    queueSystem.sections = parsedData.sections || {
      Bakery: 1,
      Butcher: 1,
      Fishmonger: 1,
      Deli: 1,
    };

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
    return "Exit";
  }

  let queue = loadQueue();

  if (answer === "Request Ticket") {
    const userNamePrompt = new Input({
      message: "Enter your name",
      initial: queue.user || "",
    });
    const userName = await userNamePrompt.run();
    queue.user = userName;

    if (!userName) {
      console.log("Please enter a name");
      return;
    }

    const sectionPrompt = new Select({
      name: "section",
      message: "Select a section",
      choices: ["Bakery", "Butcher", "Fishmonger", "Deli"],
    });

    const section = await sectionPrompt.run();
    console.log(queue.requestTicket(section));
  }

  if (answer === "Show Queue") {
    const sectionPrompt = new Select({
      name: "section",
      message: "Select a section to view",
      choices: ["Bakery", "Butcher", "Fishmonger", "Deli"],
    });

    const section = await sectionPrompt.run();
    console.log(
      `${section} queue: ${JSON.stringify(queue.showQueue(section), null, 2)}`
    );
  }

  if (answer === "Call Next") {
    const sectionPrompt = new Select({
      name: "section",
      message: "Select a section to call the next ticket",
      choices: ["Bakery", "Butcher", "Fishmonger", "Deli"],
    });

    const section = await sectionPrompt.run();
    console.log(queue.callNext(section));
  }

  if (answer === "Average Wait Time") {
    const averageWaitTimes = queue.averageWaitTimeForAll();

    console.log("The average wait time for each ticket is:");
    for (const [section, waitTime] of Object.entries(averageWaitTimes)) {
      console.log(`  - ${section}: ${waitTime.toFixed(2)} minutes`);
    }
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
}

(async () => {
  let code;
  do {
    code = await mainMenu();
  } while (code !== "Exit");
})();
