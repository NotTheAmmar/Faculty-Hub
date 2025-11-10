# CSV Import Format Guide

## Overview

The Faculty Hub supports importing multiple faculty members at once via CSV files. This guide explains the complete CSV format including how to include manual LinkedIn data (experience, projects, certifications).

## Quick Reference

| Field | Required | Type | Example |
|-------|----------|------|---------|
| name | ✅ Yes | Text | `Dr. John Doe` |
| designation | ❌ Optional | Dropdown | `Professor` (see [list](#recommended-designations)) |
| department | ❌ Optional | Dropdown | `Computer Science` (see [list](#recommended-departments)) |
| office_location | ❌ Optional | Text | `Building A Room 305` |
| email | ❌ Optional | Email | `john.doe@edu` |
| linkedin_url | ❌ Optional | URL | `https://linkedin.com/in/johndoe` |
| google_scholar_url | ❌ Optional | URL | `https://scholar.google.com/...` |
| headline | ❌ Optional | Text | `AI and ML Researcher` |
| profile_picture_url | ❌ Optional | URL | `https://example.com/pic.jpg` |
| experience | ❌ Optional | Formatted | `Position\|Company\|Duration;...` |
| projects | ❌ Optional | Formatted | `Title\|Description;...` |
| certifications | ❌ Optional | Formatted | `Name\|Issuer;...` |

## CSV Columns

### Required Column
- `name` - Faculty full name (must not be empty)

### Basic Information (Optional)
- `designation` - Academic designation (see [Recommended Designations](#recommended-designations) below)
  - Note: Can also use column name `title` for backward compatibility
- `department` - Department name (see [Recommended Departments](#recommended-departments) below)
- `office_location` - Office location (e.g., "Building A, Room 305")
- `email` - Email address (validated format)
- `linkedin_url` - Full LinkedIn profile URL
- `google_scholar_url` - Full Google Scholar profile URL
- `headline` - Professional headline or tagline
- `profile_picture_url` - URL to profile picture/photo

### LinkedIn Data (Optional)
- `experience` - Work experience and employment history
- `projects` - Research projects or initiatives
- `certifications` - Professional certifications and credentials

## Recommended Designations

The following designation values are available in the admin dropdown menu. **Using these exact values is recommended** for consistency:

- `Assistant Professor`
- `Associate Professor`
- `Professor`
- `Head of Department`
- `Lab Attendant`
- `Research Scholar`
- `Visiting Professor`
- `Emeritus Professor`
- `Lecturer`
- `Senior Lecturer`

**Note**: You can use other values if needed (e.g., "Dean", "Vice Chancellor"), but the above values will appear in dropdown menus in the admin interface.

## Recommended Departments

The following department values are available in the admin dropdown menu. **Using these exact values is recommended** for consistency:

- `Computer Science`
- `Mechanical Engineering`
- `Civil Engineering`
- `Electrical Engineering`
- `Electronics and Communication`
- `Information Technology`
- `Chemical Engineering`
- `Biotechnology`
- `Mathematics`
- `Physics`
- `Chemistry`
- `Management Studies`
- `Humanities`

**Note**: You can use other values if needed (e.g., "Architecture", "Data Science"), but the above values will appear in dropdown menus in the admin interface.

## Data Format Specifications

### Experience Field Format

**Format**: `Position|Company|Duration;Position|Company|Duration;...`

**Rules**:
- Use pipe `|` to separate Position, Company, and Duration within each entry
- Use semicolon `;` to separate multiple experience entries
- Duration is optional (can be left empty after second pipe)

**Examples**:

Single experience:
```
Professor|MIT|2015-Present
```

Multiple experiences:
```
Professor|MIT|2015-Present;Associate Professor|Stanford University|2010-2015
```

With optional duration omitted:
```
Professor|MIT|2015-Present;Postdoctoral Researcher|ETH Zurich|
```

Full example:
```
Professor|Yale University|2012-Present;Associate Professor|Johns Hopkins|2007-2012;Assistant Professor|Duke University|2003-2007
```

### Projects Field Format

**Format**: `Title|Description;Title|Description;...`

**Rules**:
- Use pipe `|` to separate Title and Description within each entry
- Use semicolon `;` to separate multiple project entries
- Description is optional (can be left empty after first pipe)

**Examples**:

Single project:
```
AI Research Platform|Machine learning framework for education
```

Multiple projects:
```
AI Research Platform|Machine learning framework;Smart Campus System|IoT-based campus management
```

With optional description omitted:
```
Quantum Computing Lab|Advanced quantum algorithms;Photonic Systems|
```

Full example:
```
Novel Drug Synthesis|Cancer treatment compounds;Green Chemistry Initiative|Sustainable synthesis methods;Polymer Research|Bio-degradable materials
```

### Certifications Field Format

**Format**: `Name|Issuer;Name|Issuer;...`

**Rules**:
- Use pipe `|` to separate certification Name and Issuer within each entry
- Use semicolon `;` to separate multiple certification entries
- Issuer is optional (can be left empty after first pipe)

**Examples**:

Single certification:
```
AWS Certified Solutions Architect|Amazon Web Services
```

Multiple certifications:
```
AWS Certified Solutions Architect|Amazon Web Services;Deep Learning Specialization|Coursera
```

With optional issuer omitted:
```
Professional Engineer License|State Board;IEEE Senior Member|
```

Full example:
```
Board Certified Chemist|American Chemical Society;NSF CAREER Award|National Science Foundation;Teaching Excellence Award|University
```

## Complete CSV Template

### Header Row
```csv
name,designation,department,office_location,email,linkedin_url,google_scholar_url,headline,profile_picture_url,experience,projects,certifications
```

### Example Rows

**Simple Entry (Basic Info Only)**:
```csv
Dr. John Doe,Professor,Computer Science,Building A Room 305,john.doe@university.edu,https://linkedin.com/in/johndoe,https://scholar.google.com/citations?user=ABC123,AI and Machine Learning Researcher,,,
```

**Complete Entry (With LinkedIn Data)**:
```csv
Dr. Jane Smith,Associate Professor,Electrical Engineering,Building B Room 201,jane.smith@university.edu,https://linkedin.com/in/janesmith,https://scholar.google.com/citations?user=XYZ456,Power Systems and Renewable Energy Expert,https://example.com/jane.jpg,Associate Professor|Harvard University|2018-Present;Assistant Professor|Cornell University|2013-2018,Renewable Energy Grid|Smart grid optimization technology;Power System Analytics|ML-based load forecasting,IEEE Senior Member|IEEE;Professional Engineer License|State Board
```

## Full Working Example

```csv
name,designation,department,office_location,email,linkedin_url,google_scholar_url,headline,profile_picture_url,experience,projects,certifications
Dr. John Doe,Professor,Computer Science,Building A Room 305,john.doe@university.edu,https://linkedin.com/in/johndoe,https://scholar.google.com/citations?user=ABC123,AI and Machine Learning Researcher,https://example.com/photos/johndoe.jpg,Professor|MIT|2015-Present;Associate Professor|Stanford University|2010-2015,AI Research Platform|Machine learning framework for education;Smart Campus System|IoT-based campus management,AWS Certified Solutions Architect|Amazon Web Services;Deep Learning Specialization|Coursera
Dr. Jane Smith,Associate Professor,Electrical Engineering,Building B Room 201,jane.smith@university.edu,https://linkedin.com/in/janesmith,https://scholar.google.com/citations?user=XYZ456,Power Systems and Renewable Energy Expert,https://example.com/photos/janesmith.jpg,Associate Professor|Harvard University|2018-Present;Assistant Professor|Cornell University|2013-2018,Renewable Energy Grid|Smart grid optimization technology;Power System Analytics|ML-based load forecasting,IEEE Senior Member|IEEE;Professional Engineer License|State Board
Dr. Robert Johnson,Assistant Professor,Mechanical Engineering,Building C Room 410,robert.johnson@university.edu,https://linkedin.com/in/robertj,https://scholar.google.com/citations?user=DEF789,Robotics and Automation Specialist,https://example.com/photos/robertj.jpg,Assistant Professor|Georgia Tech|2020-Present;Postdoctoral Researcher|ETH Zurich|2018-2020,Autonomous Robot Navigation|Computer vision for robots;Manufacturing Automation|Industry 4.0 solutions,Certified Robotics Engineer|Robotics Society;Six Sigma Black Belt|ASQ
```

## Special Characters to Avoid

❌ **Do NOT use these characters** in your data:
- Commas `,` (used as CSV delimiter)
- Pipe `|` (used as field separator within complex fields)
- Semicolons `;` (used as entry separator within complex fields)

If you need to include these characters in text, replace them:
- Comma → use "and" or just remove
- Pipe → use hyphen `-` or colon `:`
- Semicolon → use comma or period

## Tips for Creating CSV Files

### Using Excel or Google Sheets

1. **Create headers in first row**: Copy the header row from template
2. **Fill in data row by row**: One faculty per row
3. **For complex fields** (experience, projects, certifications):
   - Type or paste the formatted string directly into the cell
   - Use the format: `Item1|Details1;Item2|Details2`
4. **Save as CSV**:
   - File → Save As → CSV (Comma delimited) (.csv)
   - **Important**: Choose "CSV UTF-8" if available

### Using Text Editor

1. **Use template**: Start with the header row
2. **Add data**: One row per faculty
3. **Ensure no line breaks** within a single row
4. **Save with UTF-8 encoding**

### Common Mistakes to Avoid

❌ **Don't** add extra commas at the end of rows  
❌ **Don't** include header row twice  
❌ **Don't** leave spaces before/after commas  
❌ **Don't** use quotes unless necessary  
✅ **Do** keep each faculty on a single line  
✅ **Do** use exactly the column names from template  
✅ **Do** use recommended designation and department values for consistency  
✅ **Do** test with 2-3 rows first before importing hundreds

### Best Practices

**For Designation Field:**
- Use exact values from the [Recommended Designations](#recommended-designations) list
- Match capitalization exactly (e.g., "Assistant Professor", not "assistant professor")
- These values will appear in dropdown menus when editing faculty

**For Department Field:**
- Use exact values from the [Recommended Departments](#recommended-departments) list  
- Match capitalization exactly (e.g., "Computer Science", not "computer science")
- These values will appear in dropdown menus when editing faculty

**Why This Matters:**
- Ensures consistency across all faculty entries
- Makes searching and filtering more reliable
- Dropdown menus in admin interface will show standardized options
- Easier for admins to edit later  

## Import Process

1. **Prepare CSV file** using format above
2. **Login to Admin Dashboard**
3. **Click "Import CSV"** button
4. **Download template** if needed (contains example data)
5. **Upload your CSV file**
6. **Preview** first 5 rows to verify format
7. **Click "Import Faculty"**
8. **Review results**: System shows how many succeeded/failed

## Validation & Error Handling

### What Gets Validated
- ✅ Name field (required)
- ✅ Email format (if provided)
- ✅ URL formats for LinkedIn, Google Scholar, profile picture

### What Happens with Errors
- **Invalid rows** are skipped and logged
- **Valid rows** are imported successfully
- **Summary report** shows: "Successful: X, Failed: Y"
- **Partial imports** are allowed (some rows can fail)

### After Import
- All imported faculty appear in Admin Dashboard
- You can edit any faculty to add/modify data
- You can delete any incorrectly imported entries
- Publications will be auto-scraped on first profile view (if Google Scholar URL provided)

## Advanced: Minimal CSV

If you only want to import basic info and add LinkedIn data manually later:

```csv
name,designation,department,email
Dr. John Doe,Professor,Computer Science,john.doe@university.edu
Dr. Jane Smith,Associate Professor,Electrical Engineering,jane.smith@university.edu
```

Then edit each faculty individually to add experience, projects, and certifications using the manual entry form.

## Need Help?

- **Sample file**: Check `sample_faculty_import.csv` in the project root for a working example
- **Template**: Download from Admin Dashboard → Import CSV → Download Template
- **Test first**: Import 1-2 test rows before doing bulk import
- **Manual fallback**: You can always add/edit data manually if CSV import has issues

---

**Last Updated**: November 6, 2025  
**Format Version**: 2.0 (with LinkedIn data support)
