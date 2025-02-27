Project Documentation: CV Builder App

1. Project Overview

CV Builder App is a web-based tool that allows users to create and customize professional CVs in real time. Users can select from five different templates, fill out structured form inputs, and see a live preview of their CV. The final document can be exported as a downloadable PDF.

2. Tech Stack

Frontend: React, TailwindCSS

Backend (TBD): Custom Node.js/Express backend or Supabase

PDF Generation: React-PDF or an alternative library

State Management: Redux Toolkit

3. Core Features

3.1 Template Selection

Users choose from 5 predefined CV templates.

The selected template dynamically updates the live preview.

3.2 Live Editing

A split-screen interface:

Left Side: Live PDF Preview

Right Side: Form fields for user input

Updates to the form fields reflect instantly in the preview.

3.3 Sections

Header (Name, Contact Details)

Summary

Work Experience

Education

Skills

3.4 PDF Generation & Download

The final document can be exported and downloaded in PDF format.

4. App Flow

4.1 Landing Page

Simple introduction and a button to start building a CV.

Users select a template before entering the editor.

4.2 CV Editor Page

Left Panel: Displays the live preview of the CV.

Right Panel: Contains structured form inputs for user data.

Top Bar: Template switcher and settings.

Bottom Bar: "Download PDF" button.

5. Live Preview Functionality

5.1 Approach

To enable real-time updates, we will:

Use Redux Toolkit to store user input.

Bind form fields to the corresponding CV sections.

Render the preview dynamically using HTML and TailwindCSS instead of react-pdf.

Optimize updates using debouncing to reduce performance overhead.

5.2 Optimized Live Preview Steps

Render the CV as an HTML component instead of using react-pdf directly in live preview.

Update the HTML preview dynamically as the user types, using Redux state.

Use React-PDF only when exporting the final document, ensuring no constant re-renders in the iframe.

Apply debounce (300ms-500ms delay) to reduce excessive updates and improve performance.

Convert the HTML preview to a PDF using html2canvas + jspdf or react-pdf only at the final export step.

6. Next Steps

Finalize backend choice (Custom Node.js vs. Supabase)

Design UI/UX for template selection and editor

Implement core state management and live preview functionality

Integrate PDF generation and export feature

