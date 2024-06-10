import json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

# Function to add a section to the PDF
def add_section(c, title, fields, start_y):
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, start_y, title)
    y = start_y - 20
    c.setFont("Helvetica", 10)
    for key, value in fields.items():
        c.drawString(70, y, f"{key}: {value}")
        y -= 15
    return y - 10

# Function to add table to the PDF
def add_table_directly_updated(c, start_y, width, height, table_data):
    # Updated headers
    headers = [
        ["Product ID", "Product Name", "Category", "Sales Velocity", "Incremental Sales"],
        ["Geographic Sales"],
        ["Inventory Levels", "Order Fulfillment Rate", "Supply Chain Efficiency", "Price", "Quality Rating"],
        ["Sustainability Certification", "Compliance Status"],
        ["Current Price", "Competitor Price", "Discount Strategy"],
        ["Bulk Purchase Discounts", "Pricing History"],
        ["Price Elasticity", "Promotional Offers", "Market Position"]
    ]

    # Split data according to updated headers
    split_data = [[] for _ in range(len(headers))]
    for row in table_data:
        for i, header in enumerate(headers):
            split_data[i].append(row[:len(header)])
            row = row[len(header):]

    # Create and style tables
    for i, (header, data) in enumerate(zip(headers, split_data)):
        table = Table([header] + data)
        style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])
        table.setStyle(style)

        table_width, table_height = table.wrap(0, 0)
        if start_y - table_height < 0:
            c.showPage()
            start_y = height - table_height - 50

        table.wrapOn(c, width, height)
        table.drawOn(c, 30, start_y - table_height)
        start_y -= table_height + 20  # Adjust position for next table

# Function to create the PDF
def create_pdf_with_json(json_file_path, file_name):
    # Read data from JSON file
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
    
    file_path = f"./{file_name}.pdf"
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    start_y = 750
    for section, fields in data.items():
        if section != "Table Data":
            start_y = add_section(c, section, fields, start_y)
            if start_y < 100:
                c.showPage()
                start_y = 750

    # Add table data directly to the PDF
    c.showPage()
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 750, "Combined Sales and Pricing Data")
    c.setFont("Helvetica", 10)

    add_table_directly_updated(c, 720, width, height, data["Table Data"])

    # Save the new PDF
    c.save()
    return file_path

# Define JSON file path
json_file_path = "./data.json"

# Create the PDF with the generated data and table data from JSON
file_name = "supplier-checklist-with-sales-and-pricing"
pdf_file_path = create_pdf_with_json(json_file_path, file_name)
pdf_file_path
