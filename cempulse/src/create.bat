@echo off
REM Create folder if it doesn't exist
mkdir @components\homeui

REM Navigate to folder
cd @components\homeui

REM Create blank files
type nul > Hero.jsx
type nul > Services.jsx
type nul > Projects.jsx
type nul > Testimonials.jsx
type nul > Contact.jsx
type nul > Footer.jsx
type nul > Navbar.jsx
type nul > HomePage.jsx

echo All files created successfully in @components\homeui
pause
