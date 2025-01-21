class QueueSystem {
  constructor(user, sharedQueue = []) {
    this.user = user;
    this.tickets = [];
    this.queue = sharedQueue;
    this.ticketIndexMap = new Map();
    this.history = [];
    this.nextTicketNumber = 1;
  }

  updateTicketIndexMap() {
    this.ticketIndexMap.clear();
    this.queue.forEach((item, index) => {
      this.ticketIndexMap.set(item.ticket, index);
    });
  }

  requestTicket() {
    const ticket = this.nextTicketNumber++;
    this.queue.push({ user: this.user, ticket });
    this.updateTicketIndexMap();
    return `Ticket requested for ${this.user}, position ${this.queue.length} in queue`;
  }

  showQueue() {
    return this.queue;
  }

  averageWaitTimeForAll() {
    const n = this.queue.length;
    if (n === 0) {
      return 0;
    }
    const totalWaitTime = (n * (n + 1)) / 2;
    return totalWaitTime / n;
  }

  callNext() {
    if (this.queue.length === 0) {
      throw new Error("Queue is empty");
    }

    const nextTicket = this.queue.shift();
    this.history.push(nextTicket);
    this.updateTicketIndexMap();
    return `Ticket called for ${nextTicket.user}, ticket number ${nextTicket.ticket}`;
  }

  showLastCalledTickets() {
    if (this.history.length === 0) {
      throw new Error("No tickets have been called yet");
    }

    return this.history.slice(Math.max(this.history.length - 5, 0));
  }

  emptyQueue() {
    this.queue = [];
    this.history = [];
    this.tickets = [];
    this.nextTicketNumber = 1;
    this.updateTicketIndexMap();
  }

  toString() {
    return `User: ${this.user}\nTickets: ${
      this.tickets
    }\nQueue: ${JSON.stringify(this.queue)}`;
  }
}

module.exports = QueueSystem;
