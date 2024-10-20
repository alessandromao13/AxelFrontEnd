import {Message} from "./Messages";

export class Thread {
    thread_id: string = "";
    usedGraphId: string = "";
    title: string = "";
    messages: Message[] = [];

    constructor(thread_id: string = "", usedGraphId: string = "", title: string = "", messages: Message[] = []) {
        this.usedGraphId = usedGraphId;
        this.title = title;
        this.messages = messages;
        this.thread_id = thread_id
    }

}
