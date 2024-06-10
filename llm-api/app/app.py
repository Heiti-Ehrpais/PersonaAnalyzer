import os
import tempfile
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import PDFPlumberLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.schema import Document
from prompt import EXAMPLE_PROMPT
from persona import (
    PROVEN_SUCCESS_PROMPT,
    INVENTORY_MANAGEMENT_PROMPT,
    COMPETITIVE_PRICING_PROMPT,
    QUALITY_PRODUCTS_PROMPT,
    LEGAL_COMPLIANCE_PROMPT,
    ETHICAL_SUSTAINABILITY_PROMPT,
    INSURANCE_REQUIREMENTS_PROMPT,
    AUDITS_CERTIFICATIONS_PROMPT,
)

# Load environment variables
dotenv_path = ".env.sample"
load_dotenv(dotenv_path)

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_KEY")

# Global session data
global_session = {
    "docs": None,
    "metadatas": None,
    "prompt": None,
}

# Enable CORS for all routes and allow requests from localhost:3000
CORS(app, resources={r"/*": {"origins": "*"}})

api_key = os.getenv("OPENAI_API_KEY")


def get_persona_prompt(persona: str) -> PromptTemplate:
    if persona == "proven_success":
        return PROVEN_SUCCESS_PROMPT
    elif persona == "inventory_management":
        return INVENTORY_MANAGEMENT_PROMPT
    elif persona == "competitive_pricing":
        return COMPETITIVE_PRICING_PROMPT
    elif persona == "quality_products":
        return QUALITY_PRODUCTS_PROMPT
    elif persona == "legal_compliance":
        return LEGAL_COMPLIANCE_PROMPT
    elif persona == "ethical_sustainability":
        return ETHICAL_SUSTAINABILITY_PROMPT
    elif persona == "insurance_requirements":
        return INSURANCE_REQUIREMENTS_PROMPT
    elif persona == "audits_certifications":
        return AUDITS_CERTIFICATIONS_PROMPT
    else:
        return PROVEN_SUCCESS_PROMPT


global_session["prompt"] = get_persona_prompt("proven_success").template


def process_file(file_content: bytes) -> list:
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        temp_path = tmp_file.name
        tmp_file.write(file_content)

    loader = PDFPlumberLoader(temp_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=3000, chunk_overlap=100)
    docs = text_splitter.split_documents(documents)
    for i, doc in enumerate(docs):
        doc.metadata["source"] = f"source_{i}"

    os.remove(temp_path)
    return docs


def create_search_engine(docs: list):
    encoder = OpenAIEmbeddings(model="text-embedding-ada-002")
    client = chromadb.EphemeralClient()
    client_settings = Settings(allow_reset=True, anonymized_telemetry=False)
    search_engine = Chroma(client=client, client_settings=client_settings)
    search_engine._client.reset()
    search_engine = Chroma.from_documents(
        client=client,
        documents=docs,
        embedding=encoder,
        client_settings=client_settings,
    )
    return search_engine


@app.before_request
def before_request():
    g.session = global_session


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and file.content_type == "application/pdf":
        docs = process_file(file.read())
        g.session["docs"] = [doc.page_content for doc in docs]
        g.session["metadatas"] = [doc.metadata for doc in docs]
        print("Session after file upload:", g.session)
        return jsonify({"message": "File processed successfully"}), 200
    else:
        return jsonify({"error": "Unsupported file type"}), 400


@app.route("/set_persona", methods=["POST"])
def set_persona():
    persona = request.json.get("persona")
    if not persona:
        return jsonify({"error": "No persona provided"}), 400
    try:
        prompt = get_persona_prompt(persona)
        g.session["prompt"] = prompt.template
        print("Session after setting persona:", g.session)
        return jsonify({"message": f"Selected persona: {persona}"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route("/query", methods=["POST"])
def query():
    print("Request:", request.json)
    print("Session before accessing query:", g.session)

    query = request.json.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    docs_content = g.session.get("docs")
    metadatas = g.session.get("metadatas")
    prompt_template = g.session.get("prompt")
    print("Session during query (before check):", g.session)

    if not (docs_content and metadatas and prompt_template):
        print("Session during query (not initialized):", g.session)
        return jsonify({"error": "Session not properly initialized"}), 400

    docs = [
        Document(page_content=content, metadata=metadata)
        for content, metadata in zip(docs_content, metadatas)
    ]
    prompt = PromptTemplate(
        template=prompt_template, input_variables=["question", "context"]
    )

    search_engine = create_search_engine(docs)
    llm = ChatOpenAI(model="gpt-4", api_key=api_key, temperature=0, streaming=False)
    chain = RetrievalQAWithSourcesChain.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=search_engine.as_retriever(max_tokens_limit=4097),
        chain_type_kwargs={"prompt": prompt, "document_prompt": EXAMPLE_PROMPT},
    )
    response = chain(query)
    answer = response["answer"]
    sources = response["sources"].strip()
    source_elements = []

    all_sources = [m["source"] for m in metadatas]

    if sources:
        found_sources = []
        for source in sources.split(","):
            source_name = source.strip().replace(".", "")
            try:
                index = all_sources.index(source_name)
            except ValueError:
                continue
            text = docs[index].page_content
            found_sources.append(source_name)
            source_elements.append({"source": source_name, "content": text})

        if found_sources:
            answer += f"\nSources: {', '.join(found_sources)}"
        else:
            answer += "\nNo sources found"

    print("Session during query (initialized):", g.session)
    return jsonify({"answer": answer, "sources": source_elements}), 200


@app.route("/clear_session", methods=["POST"])
def clear_session():
    global_session.clear()
    global_session.update(
        {
            "docs": None,
            "metadatas": None,
            "prompt": None,
        }
    )
    print("Session cleared:", global_session)
    return jsonify({"message": "Session cleared"}), 200


if __name__ == "__main__":
    app.run(debug=True)
