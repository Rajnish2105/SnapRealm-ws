import { WebSocket } from "ws";

export class InboxManager {
  private static instance: InboxManager;
  public inboxes: Map<string, Inboxes>;
  public users: Map<number, User>;

  constructor() {
    this.inboxes = new Map();
    this.users = new Map();
  }

  static getInstance() {
    if (!InboxManager.instance) {
      InboxManager.instance = new InboxManager();
    }
    return InboxManager.instance;
  }

  async sendMessage(inboxId: string, message: string,senderId:string) {
    let inbox = this.inboxes.get(inboxId);
    inbox?.users.forEach((user) => {
      if (this.users)
        user.ws.forEach((client) => {
          client.send(
            JSON.stringify({ type: `inbox/${inboxId}`, data: { message,senderId } })
          );
        });
    });
  }

  async joinInbox(userId: number, inboxId: string, ws: WebSocket) {
    let inbox = this.inboxes.get(inboxId);
    let user = this.users.get(userId);

    if (!inbox) {
      this.inboxes.set(inboxId, { inboxId, users: new Map() });
      inbox = this.inboxes.get(inboxId);
    }
    if (!user) {
      this.users.set(userId, { id: userId, ws: new Set() });
      user = this.users.get(userId);
    }

    user?.ws.add(ws);
    inbox?.users.set(userId, user as User);
    console.log(inbox);
  }
}

type Inboxes = {
  inboxId: string;
  users: Map<number, User>;
};

type User = {
  id: number;
  ws: Set<WebSocket>;
};
