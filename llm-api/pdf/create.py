import random
from reportlab.lib.pagesizes import A3
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

# Function to generate random data for the PDF
def generate_random_data():
    return {
        "Company Information": {
            "Company Legal Name": f"{random.choice(['XYZ', 'ABC', '123'])} Manufacturing Inc.",
            "Company Address": f"{random.randint(100, 999)} Industrial Way, {random.choice(['Springfield', 'Metropolis', 'Gotham'])}, {random.choice(['IL', 'NY', 'CA'])} {random.randint(10000, 99999)}",
            "DUNS Number": f"{random.randint(100000000, 999999999)}",
            "Relationship with Company": random.choice(["Direct Employee", "Third Party"]),
            "Current Position": random.choice(["CFO", "CEO", "Administrator"]),
            "Type of Legal Entity": random.choice(["Corporation", "LLC", "Sole Proprietor"]),
            "Annual Gross Revenue": random.choice(["$50M - $100M", "$10M - $50M", "Greater than $100M"]),
            "Export Business Office Locations": random.choice(["USA, China", "USA, Mexico", "USA, Canada"]),
            "Factory Locations": random.choice(["China, Mexico", "Mexico, Canada", "China, India"]),
            "Warehousing Facilities": random.choice(["Yes", "No"]),
            "Factoring Relationship": random.choice(["Yes", "No"]),
            "Remittance Address": "Same as company address",
            "Company Website": f"www.{random.choice(['xyz', 'abc', '123'])}mfg.com",
            "DBA": f"{random.choice(['XYZ', 'ABC', '123'])} Manufacturing",
            "Company Description": "Manufacturer of consumer electronics and home appliances",
            "Factory Directory": random.choice(["Springfield, IL; Shenzhen, China; Monterrey, Mexico", "Metropolis, NY; Beijing, China; Monterrey, Mexico"]),
        },
        "Tax Information": {
            "Tax ID Country": "USA",
            "Tax ID Type": "EIN",
            "Tax ID": f"{random.randint(10, 99)}-{random.randint(1000000, 9999999)}",
            "Foreign Person Conducting Trade in the USA": random.choice(["Yes", "No"]),
            "Complete Tax Form": random.choice(["W-9 Form", "W-8 Form"]),
        },
        "Product Submission": {
            "Products Made in USA": random.choice(["Yes", "No"]),
            "Licensed/Royalty Products": random.choice(["Yes", "No"]),
            "Brokered Products": random.choice(["Yes", "No"]),
            "Distributed Products": random.choice(["Yes", "No"]),
            "Interested in Private Label": random.choice(["Yes", "No"]),
            "Retail Site URLs": f"www.{random.choice(['xyz', 'abc', '123'])}mfg.com/store",
            "Fit for Walmart": "High-quality, competitively priced electronics with a strong market presence",
            "Product Catalog": "(Attach product spreadsheet with GTINs, UPCs, EANs, ISBNs, or SKUs)",
        },
        "Contacts": {
            "CEO": random.choice(["John Doe", "Jane Smith", "Mark Johnson"]),
            "CFO": random.choice(["Sarah Lee", "Tom Williams", "Kevin White"]),
            "Administrator": random.choice(["Lisa Brown", "Nancy Black", "Chris Blue"]),
            "Accounts Payable": random.choice(["Jessica Grey", "Daniel Silver", "Laura Gold"]),
            "Account Representative": random.choice(["Alex Purple", "Rachel Orange", "Karen Yellow"]),
            "Customer Service (Customer)": random.choice(["Mike Green", "Nancy Black", "Lisa Brown"]),
            "Customer Service (Walmart)": random.choice(["Kevin White", "Chris Blue", "Sarah Lee"]),
            "Facilities": random.choice(["Tom Williams", "Jessica Grey", "Daniel Silver"]),
            "Fulfillment Center After Hours Support": random.choice(["Laura Gold", "Alex Purple", "Rachel Orange"]),
            "Fulfillment Center IT": random.choice(["Karen Yellow", "Mike Green", "Nancy Black"]),
            "Supply Chain": random.choice(["Lisa Brown", "Kevin White", "Chris Blue"]),
            "Orders": random.choice(["Sarah Lee", "Tom Williams", "Jessica Grey"]),
            "Operations": random.choice(["Daniel Silver", "Laura Gold", "Alex Purple"]),
            "Regulatory Compliance": random.choice(["Rachel Orange", "Karen Yellow", "Mike Green"]),
            "Returns": random.choice(["Nancy Black", "Lisa Brown", "Kevin White"]),
            "Content Expert": random.choice(["Chris Blue", "Sarah Lee", "Tom Williams"]),
        },
        "Product & Brand": {
            "Selling In-Store": random.choice(["Yes", "No"]),
            "Brand IDs": random.choice(["Yes", "No"]),
            "Selling Fresh Produce": random.choice(["Yes", "No"]),
            "Selling Other Food/Beverage Products": random.choice(["Yes", "No"]),
        },
        "Insurance": {
            "Carrier Company": "XYZ Insurance Co.",
            "Address": f"{random.randint(100, 999)} Insurance Blvd, {random.choice(['Metropolis', 'Gotham', 'Springfield'])}, {random.choice(['NY', 'IL', 'CA'])} {random.randint(10000, 99999)}",
            "Phone Number": f"(555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "Carrier Email": "info@xyzinsurance.com",
            "Policy Expiration Date": f"12/31/{random.randint(2024, 2026)}",
            "Coverage Amount": "$5,000,000",
            "Insurance Letter": "(Attach insurance certificate)",
        },
        "EDI-B2B": {
            "Products Sold At": random.choice(["Walmart", "Sam's Club", "Walmart, Sam's Club"]),
            "EDI Integration": "Yes",
            "WebEDI Mailbox Created": "Yes",
            "Global Enterprise Mailbox": "Yes",
            "Using Documents (ASN, Invoice, PO)": "Yes",
            "Not for Resale or Pharmacy": "No",
            "More Than 15,000 Documents/Year": random.choice(["Yes", "No"]),
        },
        "Banking": {
            "Bank Account Type": random.choice(["Checking", "Savings"]),
            "Bank Name": random.choice(["First National Bank", "Second National Bank", "Third National Bank"]),
            "Routing Number": f"{random.randint(100000000, 999999999)}",
            "Account Holder Name": f"{random.choice(['XYZ', 'ABC', '123'])} Manufacturing Inc.",
            "Bank Account Number": f"{random.randint(1000000000, 9999999999)}",
            "Wire Payment Account": random.choice(["Yes", "No"]),
            "Intermediary Bank": random.choice(["Yes", "No"]),
        },
        "Diversity": {
            "Majority Ownership": random.choice(["Yes", "No"]),
            "Ownership Category": random.choice(["Women", "Veterans", "LGBTQ"]),
            "Diversity Certifications": random.choice(["Women's Business Enterprise National Council (WBENC)", "National Gay & Lesbian Chamber of Commerce (NGLCC)", "National Veteran-Owned Business Association (NaVOBA)"]),
            "Certification Number": f"WB{random.randint(100000, 999999)}",
            "Expiration Date": f"12/31/{random.randint(2024, 2026)}",
        },
        "Quote": {
            "Quote Management System": "(Details input in Quote Management application)",
            "Product Information": "Provided in system",
            "Price/Sample Tag": "Provided in system",
            "Duty Information & Freight Costing": "Provided in system",
            "Pack": "Provided in system",
            "Shipment Schedule": "Provided in system",
        },
        "Facility": {
            "Factory Name": random.choice(["Shenzhen Electronics Factory", "Beijing Electronics Factory", "Shanghai Electronics Factory"]),
            "Factory Address": f"{random.randint(100, 999)} Factory Rd, {random.choice(['Shenzhen', 'Beijing', 'Shanghai'])}, China",
            "Retail Market/Buyer": "Walmart",
            "Business License": "(Attach business license)",
            "Walmart Business Information": "Private Brand",
        },
        "Logistics": {
            "Delivering Directly to Stores": random.choice(["Yes", "No"]),
            "Using ASN": random.choice(["Yes", "No"]),
            "US Based Presence": random.choice(["Yes", "No"]),
            "Daily Inventory Updates": random.choice(["Yes", "No"]),
            "Order Receipt Acknowledgment": random.choice(["Yes", "No"]),
            "On-Site Warehouse Management": random.choice(["Yes", "No"]),
            "Same-Day Shipping": random.choice(["Yes", "No"]),
            "Ship with Assigned Carrier": random.choice(["Yes", "No"]),
            "Plain Packaging Compliance": random.choice(["Yes", "No"]),
        },
        "Acknowledgments": {
            "Compliance and Safety Documents": "Reviewed and acknowledged",
            "Standards for Supplier": "Reviewed and acknowledged",
            "Responsible Sourcing Audit Policy": "Reviewed and acknowledged",
            "Code of Conduct": "Reviewed and acknowledged",
            "Product Safety": "Reviewed and acknowledged",
        },
        "Agreements": {
            "Master Supplier Agreement": "Accepted",
            "Business Terms Agreement": "Accepted",
        },
        "Walmart.com DSV and Owned Contacts": {
            "DSV After Hours Support": "Added",
            "DSV Escalation": "Added",
            "DSV IT": "Added",
            "DSV Primary": "Added",
            "Finance Auto Chargeback": "Added",
            "DSV Claims": "Added",
            "Owned Primary": "Added",
            "Owned Escalation": "Added",
            "Owned IT": "Added",
        },
        "Assign Facility to Agreement": {
            "Agreement Number": "123456789",
            "Facility Mapped": "Yes",
        },
        "Item Setup": {
            "6-digit Supplier Number": "654321",
            "9-digit Agreement Number": "123456789",
            "Item Creation": "(Followed setup in item platform)",
        },
        "Products sold": {}
    }

# Function to create a PDF with the generated data
def create_pdf(data, file_path):
    c = canvas.Canvas(file_path, pagesize=A3)
    width, height = A3
    
    # Function to add a section to the PDF
    def add_section(title, fields, start_y):
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, start_y, title)
        y = start_y - 20
        c.setFont("Helvetica", 10)
        for key, value in fields.items():
            c.drawString(70, y, f"{key}: {value}")
            y -= 15
        return y - 10

    # Add each section to the PDF
    start_y = height - 50  # Adjust start_y for A3 height
    for section, fields in data.items():
        start_y = add_section(section, fields, start_y)
        if start_y < 100:
            c.showPage()
            start_y = height - 50  # Reset start_y for new page in A3 size

    # Now add the table to the PDF
    def add_table(data, start_y):
        # Split headers and data into two tables
        header1 = ["Product ID", "Product Name", "Category", "Sales Velocity", "Incremental Sales", "Geographic Sales"]
        header2 = ["Inventory Levels", "Order Fulfillment Rate", "Supply Chain Efficiency", "Price", "Quality Rating", "Sustainability Certification", "Compliance Status"]
        
        table_data1 = [header1]
        table_data2 = [header2]
        
        # Split data into two parts
        for row in data:
            row1 = row[:6]  # First part of the row
            row2 = row[6:]  # Second part of the row
            table_data1.append(row1)
            table_data2.append(row2)
        
        # Create the tables
        table1 = Table(table_data1)
        table2 = Table(table_data2)
        
        # Add style to the tables
        style1 = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])
        style2 = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])
        
        table1.setStyle(style1)
        table2.setStyle(style2)
        
        # Calculate the table height and adjust the starting position if necessary
        table1_width, table1_height = table1.wrap(0, 0)
        table2_width, table2_height = table2.wrap(0, 0)
        
        if start_y - table1_height - table2_height < 0:
            c.showPage()
            start_y = height - table1_height - table2_height - 50
        
        table1.wrapOn(c, width, height)
        table2.wrapOn(c, width, height)
        
        table1.drawOn(c, 30, start_y - table1_height)
        table2.drawOn(c, 30, start_y - table1_height - table2_height - 10)  # 10 units space between tables
    
    # Define the table data as a list of lists
    table_data = [
        ["1001", "Smartphone A", "Electronics", "450 units/day", "15%", 
         "California: 150 units/day; Texas: 120 units/day; New York: 100 units/day", 
         "1200 units", "98%", "99%", "$299.99", "4.6/5", "Energy Star", "Compliant"],
        ["1002", "Laptop B", "Electronics", "300 units/day", "10%", 
         "Florida: 90 units/day; Illinois: 80 units/day; Ohio: 70 units/day", 
         "900 units", "95%", "98%", "$799.99", "4.3/5", "EPEAT", "Compliant"],
        ["1003", "Blender C", "Home Appliances", "200 units/day", "12%", 
         "Texas: 70 units/day; New York: 60 units/day; California: 50 units/day", 
         "800 units", "97%", "97%", "$49.99", "4.7/5", "UL Certified", "Compliant"],
        ["1004", "Headphones D", "Electronics", "500 units/day", "18%", 
         "Washington: 130 units/day; Oregon: 100 units/day; Nevada: 90 units/day", 
         "1100 units", "96%", "96%", "$59.99", "4.8/5", "RoHS", "Compliant"],
        ["1005", "Coffee Maker E", "Home Appliances", "250 units/day", "14%", 
         "New Jersey: 70 units/day; Pennsylvania: 60 units/day; Maryland: 50 units/day", 
         "700 units", "93%", "95%", "$39.99", "4.5/5", "Energy Star", "Compliant"],
        ["1006", "Microwave F", "Home Appliances", "400 units/day", "20%", 
         "California: 120 units/day; Texas: 100 units/day; Florida: 90 units/day", 
         "1000 units", "99%", "98%", "$79.99", "4.6/5", "UL Certified", "Compliant"],
        ["1007", "Refrigerator G", "Home Appliances", "150 units/day", "8%", 
         "New York: 50 units/day; Illinois: 40 units/day; Ohio: 30 units/day", 
         "600 units", "94%", "97%", "$999.99", "4.4/5", "EPEAT", "Compliant"],
        ["1008", "Air Conditioner H", "Home Appliances", "350 units/day", "16%", 
         "Texas: 110 units/day; Florida: 90 units/day; California: 80 units/day", 
         "950 units", "98%", "97%", "$249.99", "4.7/5", "Energy Star", "Compliant"],
        ["1009", "Television I", "Electronics", "600 units/day", "22%", 
         "California: 180 units/day; New York: 150 units/day; Texas: 130 units/day", 
         "1300 units", "99%", "99%", "$499.99", "4.9/5", "Energy Star", "Compliant"],
        ["1010", "Vacuum Cleaner J", "Home Appliances", "275 units/day", "11%", 
         "Washington: 80 units/day; Oregon: 70 units/day; Nevada: 60 units/day", 
         "850 units", "95%", "96%", "$199.99", "4.6/5", "UL Certified", "Compliant"]
    ]
    
    add_table(table_data, start_y)
    
    c.save()

# Generate three sets of random data
data_sets = [generate_random_data() for _ in range(3)]

# Create PDFs for each data set with specific names
for i, data in enumerate(data_sets):
    file_name = f"supplier-checklist-random-{i+1}.pdf"
    create_pdf(data, file_name)
