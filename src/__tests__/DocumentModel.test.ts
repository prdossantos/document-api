import DocumentModel from "../models/DocumentModel";


describe("test DocumentModel::validation", () => {
    it("case 1. must return that the document is required", () => {
        const hasErrors = (new DocumentModel({})).validateSync(["document"]);
        expect(hasErrors?.message).toContain("document:");
    });
    it("case 2. should return that it is not a valid document", () => {
        const hasErrors = (new DocumentModel({document: "123"})).validateSync(["document"]);
        expect(hasErrors?.message).toContain("is not a valid document");
    });
});