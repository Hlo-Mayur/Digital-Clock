# Digital Clock: Precision & Aesthetics

&#9200 &#9200

This project delivers a **modern and aesthetic digital clock web application**, designed for both beauty and accurate timekeeping. Drawing inspiration from Coding Snow's elegant designs, it offers a sleek user experience while leveraging a **C backend to ensure highly precise time calculations**.

## Features

* **Beautiful, Glowing Digital Display:** A visually striking user interface with a smooth, glowing effect for enhanced readability.
* **12/24-Hour Format Switch:** Seamlessly toggle between 12-hour (AM/PM) and 24-hour time formats to suit your preference.
* **Current Date Display:** Clearly shows the current date alongside the time.
* **C-Powered Time Accuracy:** The core time logic is handled by a robust C program, guaranteeing exceptional accuracy.

## Demo

Experience the live application here:

[![Live Demo](https://hlo-mayur.github.io/Digital-Clock/)]


## Screenshots

Capture the look and feel of the Digital Clock:

| Digital Clock Display | 12/24 Hour Switch |
| :-------------------: | :---------------: |
| ![Screenshot 1](./images/stopwatch) | ![Screenshot 2](./images/12hr.png) |


## Project Structure

Digital Clock/
├── index.html          // The main HTML structure of the web application
├── style.css           // Stylesheet for the clock's visual design and aesthetics
├── script.js           // Frontend JavaScript for interactivity, UI updates, and format switching
├── clock_server.c      // The C program source responsible for accurate time calculations and serving time data
├── clock_server        // Compiled executable of the C clock server (Linux/macOS)
├── bridge.js           // JavaScript to facilitate communication between the frontend and the C backend
├── README.md           // This project documentation file

├── stopwatch.html      // HTML for a potential separate stopwatch component or page
├── stopwatch.css       // Stylesheet for the stopwatch component
├── stopwatch.js        // JavaScript for the stopwatch functionality