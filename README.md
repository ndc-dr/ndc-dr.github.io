# Disaster Recovery Data Center - Technical Knowledge Portal
**Bangladesh Computer Council (BCC)**  
Official Portal: `https://ndc-dr.github.io/`

---

## 1. System Overview
The **NDC Technical Knowledge Portal** is an engineering documentation portal, knowledge management wiki, and procedure library designed for facility engineers, electrical/mechanical technicians, and operations personnel at the National Data Center (NDC), Bangladesh Computer Council (BCC).

The portal operates as a **100% static client-side web application hosted on GitHub Pages**, while all large technical documentation (PDFs, manuals, CAD drawings, spreadsheets) reside securely inside **Google Drive**.

---

## 2. Core Architecture
- **Static Hosting:** GitHub Pages (Zero backend server, zero server maintenance costs).
- **Decoupled Metadata:** Content (documents, equipment, systems, procedures, troubleshooting, and glossary entries) is stored strictly in JSON files under `/data/`.
- **UI & Presentation:** Vanilla ES6+ JavaScript, CSS Custom Properties (with Dark/Light Mode), Mermaid.js for interactive topology diagrams.
- **Search Engine:** Client-side fuzzy and field-specific index covering titles, equipment, manufacturers, tags, and acronyms.
- **Storage Integration:** Google Drive links for both direct downloading and zero-latency embedded iframe previews.

---

## 3. Maintenance & Update Workflow

### How to Add a New Document:
1. **Upload Document to Google Drive:**
   - Upload the target document (e.g., `Transformer_Testing_2026.pdf`) to your official NDC Google Drive repository folder.
   - Set the document sharing permission to:
     - `Anyone with the link can view` (for public documentation), OR
     - `Specific domain access` (for internal BCC staff).
   - Copy the share link. Extract the unique file ID from the link:
     ```text
     [https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74l4300sample/view?usp=sharing](https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74l4300sample/view?usp=sharing)
                                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                      File ID
     ```
2. **Add Metadata Entry to `/data/documents.json`:**
   Open `data/documents.json` and append a new JSON object:
   ```json
   {
     "id": "DOC-ELEC-007",
     "title": "Cast Resin Transformer Preventive Maintenance Manual",
     "category": "Electrical Infrastructure",
     "subcategory": "Power Transformers",
     "type": "Manual",
     "system": "Power System",
     "manufacturer": "Siemens",
     "model": "GEAFOL 2500kVA",
     "description": "Thermography survey rules and Tan Delta testing benchmarks.",
     "version": "Rev-1",
     "date": "2026-03-01",
     "tags": ["Transformer", "Electrical", "Preventive"],
     "driveUrl": "[https://drive.google.com/file/d/](https://drive.google.com/file/d/)<FILE_ID>/view?usp=sharing",
     "driveFileId": "<FILE_ID>",
     "visibility": "public",
     "featured": true
   }
