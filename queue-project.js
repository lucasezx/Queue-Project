const fs = require("fs");

const SECTION_NAMES = Object.freeze([
  "Bakery",
  "Butcher",
  "Fishmonger",
  "Deli",
  "Checkout",
]);

class QueueSystem {
  constructor(user, sharedQueue = []) {
    this.user = user;
    this.tickets = [];
    this.queue = sharedQueue;
    this.history = [];
    this.sections = SECTION_NAMES.reduce((acc, section) => {
      acc[section] = 1;
      return acc;
    }, {});
  }

  requestTicket(section) {
    const ticketNumber = this.sections[section]++;
    this.queue.push({
      user: this.user,
      ticket: ticketNumber,
      section,
      priority: false,
    });
    const positionInSection = this.queue.filter(
      (item) => item.section === section
    ).length;
    return `Ticket for ${section} requested for ${this.user}, position ${positionInSection} in queue`;
  }

  requestPriorityTicket(section) {
    const ticketNumber = this.sections[section]++;
    this.queue.push({
      user: this.user,
      ticket: ticketNumber,
      section,
      priority: true,
    });
    const positionInSection = this.queue.filter(
      (item) => item.section === section
    ).length;
    return `Priority Ticket for ${section} requested for ${this.user}, position ${positionInSection} in queue`;
  }

  showQueue(section) {
    return this.queue.filter((item) => item.section === section);
  }

  averageWaitTimeForAll() {
    const sectionWaitTimes = SECTION_NAMES.reduce((acc, section) => {
      acc[section] = 0;
      return acc;
    }, {});

    const sectionCount = SECTION_NAMES.reduce((acc, section) => {
      acc[section] = 0;
      return acc;
    }, {});

    this.queue.forEach((item) => {
      const { section } = item;
      const sectionTime =
        this.queue.filter((q) => q.section === section).indexOf(item) + 1;

      sectionWaitTimes[section] += sectionTime;
      sectionCount[section]++;
    });

    const sectionAverages = {
      Bakery: sectionWaitTimes.Bakery / sectionCount.Bakery,
      Butcher: sectionWaitTimes.Butcher / sectionCount.Butcher,
      Fishmonger: sectionWaitTimes.Fishmonger / sectionCount.Fishmonger,
      Deli: sectionWaitTimes.Deli / sectionCount.Deli,
    };

    return sectionAverages;
  }

  callNext(section) {
    const sectionQueue = this.queue.filter((item) => item.section === section);
    if (sectionQueue.length === 0) {
      console.log(`There are no tickets in the ${section} queue`);
    }

    const nextTicketIndex = sectionQueue.findIndex((item) => item.priority);
    let nextTicket;

    if (nextTicketIndex !== -1) {
      nextTicket = sectionQueue[nextTicketIndex];
      this.queue = this.queue.filter((item) => item !== nextTicket);
    } else {
      nextTicket = sectionQueue.shift();
      this.queue = this.queue.filter((item) => item !== nextTicket);
    }
    this.history.push(nextTicket);
    return `Next ticket for ${section} is ${nextTicket.ticket} for ${nextTicket.user}`;
  }

  showLastCalledTickets() {
    if (this.history.length === 0) {
      throw new Error("No tickets have been called yet");
    }

    return this.history.slice(Math.max(this.history.length - 10, 0));
  }

  emptyQueue() {
    this.queue = [];
    this.history = [];
    this.tickets = [];
    this.sections = SECTION_NAMES.reduce((acc, section) => {
      acc[section] = 1;
      return acc;
    }, {});
  }

  toString() {
    return `User: ${this.user}\nTickets: ${
      this.tickets
    }\nQueue: ${JSON.stringify(this.queue)}`;
  }

  static saveQueue(queue, filePath) {
    const dataToSave = {
      user: "",
      queue: queue.queue.filter(
        (item) => item.user && item.ticket && item.section
      ),
      tickets: queue.tickets,
      history: queue.history.filter((item) => item.user && item.ticket),
      sections: SECTION_NAMES.reduce((acc, section) => {
        acc[section] = queue.sections[section] || 1;
        return acc;
      }, {}),
    };
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
  }

  static loadQueue(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const parsedData = JSON.parse(data);

      const queueSystem = new QueueSystem(parsedData.user || "");

      queueSystem.queue = (parsedData.queue || []).filter(
        (item) => item.user && item.ticket && item.section
      );
      queueSystem.tickets = parsedData.tickets || [];
      queueSystem.history = (parsedData.history || []).filter(
        (item) => item.user && item.ticket
      );
      queueSystem.sections = SECTION_NAMES.reduce((acc, section) => {
        acc[section] = parsedData.sections?.[section] || 1;
        return acc;
      }, {});

      return queueSystem;
    }
    return new QueueSystem();
  }
}

module.exports = {
  QueueSystem,
  SECTION_NAMES,
};
