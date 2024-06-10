gcloud auth login
gcloud compute ssh instance-20240527-095117 --zone=europe-north1-c

source venv/bin/activate
FLASK_APP=app/app.py flask run --host=0.0.0.0 --port=5000


gsutil cp -r gs://pactum-files/llm-api .