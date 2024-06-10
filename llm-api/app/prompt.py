from langchain.prompts import PromptTemplate
from persona import (
    PROVEN_SUCCESS_PROMPT,
    INVENTORY_MANAGEMENT_PROMPT,
    COMPETITIVE_PRICING_PROMPT,
    QUALITY_PRODUCTS_PROMPT,
    LEGAL_COMPLIANCE_PROMPT,
    ETHICAL_SUSTAINABILITY_PROMPT,
    INSURANCE_REQUIREMENTS_PROMPT,
    AUDITS_CERTIFICATIONS_PROMPT
)

WELCOME_MESSAGE = """\
Welcome to the Walmart Supplier Verification Application!
To get started:
1. Upload a PDF or text file
2. Select a persona
3. Ask any question about the file!
"""

# Default Prompt (if needed)
template = """Please act as an expert financial analyst when you answer the questions and pay special attention to the financial statements. Operating margin is also known as op margin and is calculated by dividing operating income by revenue.
Given the following extracted parts of a long document and a question, create a final answer with references ("SOURCES").
If you don't know the answer, just say that you don't know. Don't try to make up an answer.
ALWAYS return a "SOURCES" field in your answer, with the format "SOURCES: <source1>, <source2>, <source3>, ...".

QUESTION: {question}
=========
{summaries}
=========
FINAL ANSWER:"""

PROMPT = PromptTemplate(template=template, input_variables=["summaries", "question"])

EXAMPLE_PROMPT = PromptTemplate(
    template="Content: {page_content}\nSource: {source}",
    input_variables=["page_content", "source"],
)
