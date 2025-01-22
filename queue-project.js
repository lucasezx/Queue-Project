class QueueSystem {
  constructor(user, sharedQueue = []) {
    this.user = user;
    this.tickets = [];
    this.queue = sharedQueue;
    this.history = [];
    this.sections = {
      Bakery: 0,
      Butcher: 0,
      Fishmonger: 0,
      Deli: 0,
    };
  }

  requestTicket(section) {
    const ticketNumber = this.sections[section]++;
    this.queue.push({ user: this.user, ticket: ticketNumber, section });
    const positionInSection = this.queue.filter(
      (item) => item.section === section
    ).length;
    return `Ticket for ${section} requested for ${this.user}, position ${positionInSection} in queue`;
  }

  showQueue(section) {
    return this.queue.filter((item) => item.section === section);
  }

  averageWaitTimeForAll() {
    const sectionWaitTimes = {
      Bakery: 0,
      Butcher: 0,
      Fishmonger: 0,
      Deli: 0,
    };

    const sectionCount = {
      Bakery: 0,
      Butcher: 0,
      Fishmonger: 0,
      Deli: 0,
    };

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
      throw new Error(`${section} queue is empty`);
    }
    const nextTicket = sectionQueue.shift();
    this.history.push(nextTicket);
    this.queue = this.queue.filter((item) => item !== nextTicket);
    return `Ticket for ${section} called for ${nextTicket.user}, ticket number ${nextTicket.ticket}`;
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
    this.sections = {
      Bakery: 1,
      Butcher: 1,
      Fishmonger: 1,
      Deli: 1,
    };
  }

  toString() {
    return `User: ${this.user}\nTickets: ${
      this.tickets
    }\nQueue: ${JSON.stringify(this.queue)}`;
  }
}

module.exports = QueueSystem;
