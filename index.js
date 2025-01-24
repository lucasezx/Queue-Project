const { QueueSystem, SECTION_NAMES } = require("./queue-project.js");
const { Select, Input } = require("enquirer");

const FILE_PATH = "./queueData.json";

async function selectSection() {
  const sectionPrompt = new Select({
    name: "section",
    message: "Select a section",
    choices: [...SECTION_NAMES],
  });
  return await sectionPrompt.run();
}

async function mainMenu() {
  const prompt = new Select({
    name: "Queue",
    message: "Select an option",
    choices: [
      "Request Ticket",
      "Request Priority Ticket",
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

  let queue = QueueSystem.loadQueue(FILE_PATH);

  if (["Request Ticket", "Request Priority Ticket"].includes(answer)) {
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



    const section = await selectSection();
    const isPriority = answer === "Request Priority Ticket";
    console.log(queue.requestTicket(section, isPriority));
  }

  if (answer === "Show Queue") {
    const section = await selectSection();
    console.log(
      `${section} queue: ${JSON.stringify(queue.showQueue(section), null, 2)}`
    );
  }

  if (answer === "Call Next") {
    const section = await selectSection();
    console.log(queue.callNextTicket(section));
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

  QueueSystem.saveQueue(queue, FILE_PATH);
}

(async () => {
  let code;
  do {
    code = await mainMenu();
  } while (code !== "Exit");
})();
