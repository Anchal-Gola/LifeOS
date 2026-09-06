import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createDocument,
  uploadDocument,
  getDocuments,
  updateDocument,
  updateUploadedDocument,
  deleteDocument,
} from "../api/documentApi";

const API_BASE_URL = "http://localhost:5000";

function Documents() {
  const [documents, setDocuments] = useState([]);

  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [category, setCategory] = useState("general");
  const [selectedFile, setSelectedFile] = useState(null);

  const [sourceType, setSourceType] = useState("url");
  const [editingDocument, setEditingDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data.data || []);
    } catch (error) {
      console.error("Documents error:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const resetForm = () => {
    setName("");
    setFileUrl("");
    setFileType("");
    setCategory("general");
    setSelectedFile(null);
    setSourceType("url");
    setEditingDocument(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);

    if (!fileType) {
      setFileType(file.type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a document name.");
      return;
    }

    if (sourceType === "url" && !fileUrl.trim()) {
      alert("Please enter a document URL.");
      return;
    }

    if (sourceType === "upload" && !selectedFile && !editingDocument) {
      alert("Please choose a file.");
      return;
    }

    try {
      setLoading(true);

      const documentData = {
        name: name.trim(),
        category,
      };

      if (sourceType === "url") {
        documentData.fileUrl = fileUrl.trim();
        documentData.fileType = fileType.trim();
      }

      if (editingDocument) {
        if (sourceType === "upload" && selectedFile) {
          const formData = new FormData();

          formData.append("name", name.trim());
          formData.append("category", category);
          formData.append("file", selectedFile);

          await updateUploadedDocument(
            editingDocument._id,
            formData
          );
        } else {
          await updateDocument(
            editingDocument._id,
            documentData
          );
        }
      } else if (sourceType === "upload") {
        const formData = new FormData();

        formData.append("name", name.trim());
        formData.append("category", category);
        formData.append("file", selectedFile);

        await uploadDocument(formData);
      } else {
        await createDocument(documentData);
      }

      resetForm();
      await fetchDocuments();
    } catch (error) {
      console.error("Document save error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (document) => {
    setEditingDocument(document);

    setName(document.name || "");
    setCategory(document.category || "general");
    setFileUrl(
      document.sourceType === "url"
        ? document.fileUrl || ""
        : ""
    );
    setFileType(document.fileType || "");
    setSelectedFile(null);

    setSourceType(document.sourceType || "url");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteDocument(id);

      await fetchDocuments();
    } catch (error) {
      console.error("Delete document error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getDocumentUrl = (document) => {
    if (!document.fileUrl) return null;

    if (
      document.fileUrl.startsWith("http://") ||
      document.fileUrl.startsWith("https://")
    ) {
      return document.fileUrl;
    }

    return `${API_BASE_URL}${document.fileUrl}`;
  };

  const categoryCount = new Set(
    documents.map((document) => document.category || "general")
  ).size;

  const latestCount = documents.filter((document) => {
    if (!document.createdAt) return false;

    const created = new Date(document.createdAt);
    const now = new Date();

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your personal library
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Documents
              </h1>

              <p className="mt-2 text-slate-500">
                Save PDFs, files and useful online resources in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Library
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {documents.length} document
                {documents.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Documents
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {documents.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Categories
              </p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {categoryCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Added This Month
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {latestCount}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Add / Edit Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingDocument ? "✏️" : "📄"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingDocument
                    ? "Edit Document"
                    : "Add Document"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Save a URL or upload a file from your computer.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Document name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. DSA Notes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                {/* Source Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Add from
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSourceType("url")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        sourceType === "url"
                          ? "border-purple-300 bg-purple-50 text-purple-600"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      🔗 URL
                    </button>

                    <button
                      type="button"
                      onClick={() => setSourceType("upload")}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        sourceType === "upload"
                          ? "border-purple-300 bg-purple-50 text-purple-600"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      📁 Upload
                    </button>
                  </div>
                </div>

                {/* URL */}
                {sourceType === "url" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      File URL
                    </label>

                    <input
                      type="url"
                      placeholder="https://example.com/file.pdf"
                      value={fileUrl}
                      onChange={(e) =>
                        setFileUrl(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                )}

                {/* File Upload */}
                {sourceType === "upload" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Choose file
                    </label>

                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-purple-300 hover:bg-purple-50/40">
                      <span className="mb-2 text-2xl">
                        📎
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {selectedFile
                          ? selectedFile.name
                          : "Choose a file"}
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        PDF, JPG, PNG, WEBP, DOC, DOCX • Max 10MB
                      </span>

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {editingDocument &&
                      !selectedFile &&
                      editingDocument.fileName && (
                        <p className="mt-2 text-xs text-slate-500">
                          Current file:{" "}
                          <span className="font-medium">
                            {editingDocument.fileName}
                          </span>
                        </p>
                      )}
                  </div>
                )}

                {/* File Type + Category */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      File type
                    </label>

                    <input
                      type="text"
                      placeholder="PDF"
                      value={fileType}
                      onChange={(e) =>
                        setFileType(e.target.value)
                      }
                      disabled={sourceType === "upload" && !!selectedFile}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="general">
                        General
                      </option>
                      <option value="study">
                        Study
                      </option>
                      <option value="work">
                        Work
                      </option>
                      <option value="personal">
                        Personal
                      </option>
                      <option value="important">
                        Important
                      </option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingDocument
                    ? "Update Document"
                    : "Save Document"}
                </button>

                {/* Cancel */}
                {editingDocument && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Document List */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Your Documents
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {documents.length} document
                  {documents.length !== 1 ? "s" : ""} in your library
                </p>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📄
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No documents yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a URL or upload your first file to start building your library.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => {
                    const documentUrl =
                      getDocumentUrl(document);

                    return (
                      <div
                        key={document._id}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex min-w-0 gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                              {document.fileType?.includes(
                                "pdf"
                              )
                                ? "📕"
                                : document.sourceType ===
                                  "upload"
                                ? "📎"
                                : "🔗"}
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900">
                                {document.name}
                              </h3>

                              <div className="mt-2 flex flex-wrap gap-2">

                                <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-medium capitalize text-purple-600">
                                  {document.category ||
                                    "general"}
                                </span>

                                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                  {document.sourceType ===
                                  "upload"
                                    ? "Uploaded file"
                                    : "URL"}
                                </span>

                                {document.fileType && (
                                  <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium uppercase text-slate-500">
                                    {document.fileType
                                      .split("/")
                                      .pop()}
                                  </span>
                                )}
                              </div>

                              {document.fileName && (
                                <p className="mt-2 truncate text-xs text-slate-400">
                                  {document.fileName}
                                </p>
                              )}

                              {documentUrl && (
                                <a
                                  href={documentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-block text-sm font-medium text-indigo-500 hover:text-indigo-600"
                                >
                                  Open document →
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() =>
                                handleEdit(document)
                              }
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(document._id)
                              }
                              disabled={
                                deletingId === document._id
                              }
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === document._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Documents;