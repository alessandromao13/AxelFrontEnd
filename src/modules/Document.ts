export class UserDocument {
    title: string = ""
    rag_id: string = ""
    document_id: string = ""
    document: File = new File([], "")

    constructor(title: string = "", rag_id: string = "", document_id: string = "", document: File = new File([], "")) {
        this.title = title;
        this.rag_id = rag_id;
        this.document_id = document_id;
        this.document = document;
    }
}

