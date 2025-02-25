"""
Script per aggiungere le colonne mancanti alla tabella projects.
Eseguire questo script direttamente nel backend.
"""

import sqlite3
import sqlite3
import os
import sys

# Percorso del database
if len(sys.argv) > 1:
    db_path = sys.argv[1]
else:
    db_path = "backend/maigenai.db"  # Percorso predefinito

print(f"Tentativo di connessione al database: {db_path}")

if not os.path.exists(db_path):
    print(f"ERRORE: Il file database non esiste: {db_path}")
    print("Specificare il percorso corretto come argomento: python database-migration.py /percorso/al/maigenai.db")
    sys.exit(1)

# Connessione al database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Il resto del codice...
# Verifica se le colonne esistono già
cursor.execute("PRAGMA table_info(projects)")
columns = [column[1] for column in cursor.fetchall()]

# Aggiungi la colonna company_email se non esiste
if "company_email" not in columns:
    print("Aggiunta colonna company_email...")
    cursor.execute("ALTER TABLE projects ADD COLUMN company_email TEXT")

# Aggiungi la colonna freelancer_email se non esiste
if "freelancer_email" not in columns:
    print("Aggiunta colonna freelancer_email...")
    cursor.execute("ALTER TABLE projects ADD COLUMN freelancer_email TEXT")

# Commit delle modifiche
conn.commit()

# Verifica le colonne aggiornate
cursor.execute("PRAGMA table_info(projects)")
updated_columns = [column[1] for column in cursor.fetchall()]
print(f"Colonne nella tabella projects: {updated_columns}")

# Chiudi la connessione
conn.close()

print("Migrazione completata con successo!")
