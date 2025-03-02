# Étape 1 : Utilisation d’une image Python
FROM python:3.10

WORKDIR /app

# Copie uniquement les dépendances pour optimiser le cache Docker
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copie du reste du code de l’application
COPY . .


CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]
