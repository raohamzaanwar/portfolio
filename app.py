"""
Portfolio Backend — Flask server for Muhammad Hamza Anwar's portfolio.

Features:
  - Serve static frontend (index.html / style.css / script.js)
  - POST /api/contact   → save message to contacts.json + optional email
  - GET  /api/visits    → return + increment visitor counter
  - GET  /api/stats     → portfolio stats (skills, certs, projects count)
  - GET  /api/skills    → full skills list
  - GET  /api/projects  → projects list
  - GET  /api/articles  → articles/blog posts list
"""

import json
import os
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# ── App setup ──────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")
CORS(app)  # Allow requests from the browser during development

# ── File paths ─────────────────────────────────────────────────
CONTACTS_FILE = os.path.join(DATA_DIR, "contacts.json")
VISITS_FILE   = os.path.join(DATA_DIR, "visits.json")

# ── Email config (optional — fill in to enable real email) ─────
EMAIL_SENDER   = os.environ.get("PORTFOLIO_EMAIL", "")
EMAIL_PASSWORD = os.environ.get("PORTFOLIO_PASSWORD", "")
EMAIL_RECEIVER = "hamzaanwarrao@gmail.com"

# ── Helpers ────────────────────────────────────────────────────
def load_json(path: str, default):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default

def save_json(path: str, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def send_email(name: str, email: str, message: str) -> bool:
    """Send contact email via Gmail SMTP. Returns True on success."""
    if not EMAIL_SENDER or not EMAIL_PASSWORD:
        return False  # Email not configured — skip silently
    try:
        body = f"New portfolio message\n\nFrom: {name} <{email}>\n\n{message}"
        msg = MIMEText(body, "plain")
        msg["Subject"] = f"Portfolio message from {name}"
        msg["From"]    = EMAIL_SENDER
        msg["To"]      = EMAIL_RECEIVER
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
            smtp.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        return True
    except Exception as exc:
        app.logger.warning("Email send failed: %s", exc)
        return False

# ── Portfolio data ─────────────────────────────────────────────
SKILLS = {
    "offensive": [
        "Burp Suite", "Metasploit", "Nmap", "SQLMap",
        "BloodHound", "Impacket", "Wireshark", "Mimikatz",
    ],
    "defensive": [
        "MS Sentinel", "ELK Stack", "Wazuh", "Defender",
        "KQL", "Entra ID", "Intune",
    ],
    "development": ["Python", "Bash", "C++", "SQL", "Git", "Azure", "AWS"],
}

CERTIFICATIONS = [
    {"title": "CEH — Certified Ethical Hacker",           "issuer": "EC-Council",      "status": "active"},
    {"title": "CNSP — Certified Network Security Practitioner", "issuer": "SecOps Group", "status": "active"},
    {"title": "CAP — Certified AppSec Practitioner",      "issuer": "SecOps Group",    "status": "active"},
    {"title": "ISO 27001 Lead Implementer",                "issuer": "Alnafi",          "status": "active"},
    {"title": "SC-200 — Microsoft Security Operations Analyst", "issuer": "Microsoft",  "status": "in_progress"},
]

PROJECTS = [
    {
        "id": 1,
        "title": "Active Directory Lab",
        "description": "Full AD environment with attack and detection scenarios using BloodHound, Impacket, and MS Sentinel.",
        "tags": ["Active Directory", "BloodHound", "Impacket", "SIEM"],
        "github": "https://github.com/hamzaanwarrao",
    },
    {
        "id": 2,
        "title": "Web App Pentest Toolkit",
        "description": "Python scripts automating common web application penetration testing tasks.",
        "tags": ["Python", "Burp Suite", "SQLMap", "OWASP"],
        "github": "https://github.com/hamzaanwarrao",
    },
    {
        "id": 3,
        "title": "SIEM Detection Rules",
        "description": "Custom KQL detection rules for Microsoft Sentinel covering common attack TTPs.",
        "tags": ["KQL", "Sentinel", "MITRE ATT&CK"],
        "github": "https://github.com/hamzaanwarrao",
    },
    {
        "id": 4,
        "title": "CTF Writeups",
        "description": "Documented solutions for HackTheBox and TryHackMe machines and challenges.",
        "tags": ["CTF", "HackTheBox", "TryHackMe", "Writeup"],
        "github": "https://github.com/hamzaanwarrao",
    },
]

ARTICLES = [
    {
        "id": 1,
        "title": "Kerberoasting — From Theory to Detection",
        "summary": "Deep dive into Kerberoasting attacks and how to detect them with Sentinel KQL queries.",
        "tags": ["Active Directory", "Kerberos", "Detection"],
        "url": "https://medium.com/@hamzaanwarrao",
        "date": "2025-11-10",
    },
    {
        "id": 2,
        "title": "SSRF to Internal Recon",
        "summary": "Chaining SSRF vulnerabilities to enumerate internal cloud metadata endpoints.",
        "tags": ["SSRF", "Web", "Cloud"],
        "url": "https://medium.com/@hamzaanwarrao",
        "date": "2025-09-22",
    },
    {
        "id": 3,
        "title": "Building a Home SOC Lab on a Budget",
        "summary": "Step-by-step guide for setting up an ELK-based SOC lab using free tools.",
        "tags": ["Blue Team", "ELK", "Lab Setup"],
        "url": "https://medium.com/@hamzaanwarrao",
        "date": "2025-07-05",
    },
]

# ══════════════════════════════════════════════════════════════
# Routes — Static files
# ══════════════════════════════════════════════════════════════

@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

# ══════════════════════════════════════════════════════════════
# Routes — API
# ══════════════════════════════════════════════════════════════

@app.route("/api/contact", methods=["POST"])
def contact():
    """Save a contact form submission and optionally send an email."""
    data = request.get_json(silent=True) or {}

    name    = str(data.get("name",    "")).strip()
    email   = str(data.get("email",   "")).strip()
    message = str(data.get("message", "")).strip()

    # Basic validation
    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 400
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"success": False, "error": "Invalid email address."}), 400
    if len(message) > 2000:
        return jsonify({"success": False, "error": "Message too long (max 2000 chars)."}), 400

    # Persist to contacts.json
    contacts = load_json(CONTACTS_FILE, [])
    contacts.append({
        "name":      name,
        "email":     email,
        "message":   message,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })
    save_json(CONTACTS_FILE, contacts)

    # Try sending email
    email_sent = send_email(name, email, message)

    return jsonify({"success": True, "email_sent": email_sent}), 201


@app.route("/api/visits", methods=["GET"])
def visits():
    """Return total visit count and increment it by 1."""
    data = load_json(VISITS_FILE, {"count": 0})
    data["count"] += 1
    save_json(VISITS_FILE, data)
    return jsonify({"visits": data["count"]})


@app.route("/api/stats", methods=["GET"])
def stats():
    """Return high-level portfolio statistics."""
    contacts = load_json(CONTACTS_FILE, [])
    visits_data = load_json(VISITS_FILE, {"count": 0})
    return jsonify({
        "projects":      len(PROJECTS),
        "certifications": len(CERTIFICATIONS),
        "articles":      len(ARTICLES),
        "skills_count":  sum(len(v) for v in SKILLS.values()),
        "messages":      len(contacts),
        "visits":        visits_data.get("count", 0),
    })


@app.route("/api/skills", methods=["GET"])
def skills():
    return jsonify(SKILLS)


@app.route("/api/certifications", methods=["GET"])
def certifications():
    return jsonify(CERTIFICATIONS)


@app.route("/api/projects", methods=["GET"])
def projects():
    return jsonify(PROJECTS)


@app.route("/api/articles", methods=["GET"])
def articles():
    return jsonify(ARTICLES)


# ══════════════════════════════════════════════════════════════
# Entry point
# ══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 55)
    print("  Portfolio backend running at http://127.0.0.1:5000")
    print("  Open http://127.0.0.1:5000 in your browser")
    print("=" * 55)
    app.run(debug=True, port=5000)
